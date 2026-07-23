/**
 * PrismaVehicleRepository
 *
 * Implements IVehicleRepository against the Render PostgreSQL database via
 * Prisma Client.
 *
 * Write operations (save, update, delete) throw on DB failure — silent
 * in-memory fallback on writes causes data loss on server restart.
 * Read operations (findAll, findById) fall back to in-memory so the app
 * stays readable during cold-starts or transient network issues.
 *
 * Inventory sync:
 *   On save   → an Inventory row is upserted automatically (quantity 1, available true).
 *   On update → if isAvailable or stockQuantity changed the Inventory row is synced.
 *   On delete → Inventory row is cascade-deleted by the DB foreign key.
 */

import { prisma } from './prisma';
import { VehicleRepository } from '../domain/vehicle/vehicle.repository';
import type { IVehicleRepository } from '../domain/vehicle/vehicle.repository';
import type { Vehicle, VehicleFilters, VehicleUpdate } from '../domain/vehicle/vehicle.types';
import { AppError } from '../common/errors/AppError';

// ── helpers ────────────────────────────────────────────────────────────────

function toVehicle(row: any): Vehicle {
  return {
    id:            row.id,
    vin:           row.vin,
    make:          row.make,
    model:         row.model,
    year:          row.year,
    price:         row.price,
    mileage:       row.mileage       ?? 0,
    color:         row.color         ?? '',
    category:      row.category      ?? undefined,
    imageUrl:      row.imageUrl      ?? undefined,
    isAvailable:   row.isAvailable   ?? true,
    stockQuantity: row.stockQuantity ?? 1,
    createdAt:     row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
  };
}

function buildWhere(filters?: VehicleFilters): Record<string, any> {
  if (!filters) return {};
  const where: Record<string, any> = {};
  if (filters.make)  where.make  = { equals: filters.make,  mode: 'insensitive' };
  if (filters.model) where.model = { equals: filters.model, mode: 'insensitive' };
  if (filters.year        !== undefined) where.year        = filters.year;
  if (filters.availability !== undefined) where.isAvailable = filters.availability;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  return where;
}

// ── repository ─────────────────────────────────────────────────────────────

export class PrismaVehicleRepository implements IVehicleRepository {
  private readonly fallback = new VehicleRepository();

  nextId(): string {
    return crypto.randomUUID();
  }

  // ── save (WRITE — no fallback, throws on failure) ────────────────────────

  async save(vehicle: Vehicle): Promise<void> {
    try {
      await prisma.vehicle.upsert({
        where:  { id: vehicle.id },
        create: {
          id:            vehicle.id,
          vin:           vehicle.vin,
          make:          vehicle.make,
          model:         vehicle.model,
          year:          vehicle.year,
          price:         vehicle.price,
          mileage:       vehicle.mileage       ?? 0,
          color:         vehicle.color         ?? '',
          category:      vehicle.category      ?? 'Sedan',
          imageUrl:      vehicle.imageUrl      ?? null,
          isAvailable:   vehicle.isAvailable   ?? true,
          stockQuantity: vehicle.stockQuantity ?? 1,
          inventory: {
            create: {
              quantity:  vehicle.stockQuantity ?? 1,
              available: vehicle.isAvailable   ?? true,
            },
          },
        },
        update: {
          vin:           vehicle.vin,
          make:          vehicle.make,
          model:         vehicle.model,
          year:          vehicle.year,
          price:         vehicle.price,
          mileage:       vehicle.mileage       ?? 0,
          color:         vehicle.color         ?? '',
          category:      vehicle.category      ?? 'Sedan',
          imageUrl:      vehicle.imageUrl      ?? null,
          isAvailable:   vehicle.isAvailable   ?? true,
          stockQuantity: vehicle.stockQuantity ?? 1,
        },
      });
    } catch (err) {
      console.error('[PrismaVehicleRepository] save failed:', err);
      throw new AppError('Database unavailable. Please try again shortly.', 503);
    }
  }

  // ── findAll (READ — fallback to memory on failure) ───────────────────────

  async findAll(filters?: VehicleFilters): Promise<Vehicle[]> {
    try {
      const rows = await prisma.vehicle.findMany({
        where:   buildWhere(filters),
        orderBy: { createdAt: 'desc' },
      });
      return rows.map(toVehicle);
    } catch (err) {
      console.error('[PrismaVehicleRepository] findAll failed — using in-memory fallback:', err);
      return this.fallback.findAll(filters);
    }
  }

  // ── findById (READ — fallback to memory on failure) ──────────────────────

  async findById(id: string): Promise<Vehicle | null> {
    try {
      const row = await prisma.vehicle.findUnique({ where: { id } });
      return row ? toVehicle(row) : null;
    } catch (err) {
      console.error('[PrismaVehicleRepository] findById failed — using in-memory fallback:', err);
      return this.fallback.findById(id);
    }
  }

  // ── update (WRITE — no fallback, throws on failure) ──────────────────────

  async update(id: string, fields: VehicleUpdate): Promise<Vehicle | null> {
    try {
      const data: Record<string, any> = {};
      if (fields.make          !== undefined) data.make          = fields.make;
      if (fields.model         !== undefined) data.model         = fields.model;
      if (fields.year          !== undefined) data.year          = fields.year;
      if (fields.price         !== undefined) data.price         = fields.price;
      if (fields.mileage       !== undefined) data.mileage       = fields.mileage;
      if (fields.color         !== undefined) data.color         = fields.color;
      if (fields.category      !== undefined) data.category      = fields.category;
      if (fields.imageUrl      !== undefined) data.imageUrl      = fields.imageUrl;
      if (fields.isAvailable   !== undefined) data.isAvailable   = fields.isAvailable;
      if (fields.stockQuantity !== undefined) data.stockQuantity = fields.stockQuantity;

      const row = await prisma.vehicle.update({ where: { id }, data });
      const vehicle = toVehicle(row);

      // Keep Inventory table in sync when stock fields change
      if (fields.isAvailable !== undefined || fields.stockQuantity !== undefined) {
        const qty = vehicle.stockQuantity ?? 1;
        await prisma.inventory.upsert({
          where:  { vehicleId: id },
          create: { vehicleId: id, quantity: qty, available: vehicle.isAvailable ?? qty > 0 },
          update: {               quantity: qty, available: vehicle.isAvailable ?? qty > 0 },
        });
      }

      return vehicle;
    } catch (err: any) {
      if (err?.code === 'P2025') return null; // record not found — not a DB failure
      console.error('[PrismaVehicleRepository] update failed:', err);
      throw new AppError('Database unavailable. Please try again shortly.', 503);
    }
  }

  // ── delete (WRITE — no fallback, throws on failure) ──────────────────────

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.vehicle.delete({ where: { id } });
      return true;
    } catch (err: any) {
      if (err?.code === 'P2025') return false; // record not found — not a DB failure
      console.error('[PrismaVehicleRepository] delete failed:', err);
      throw new AppError('Database unavailable. Please try again shortly.', 503);
    }
  }
}
