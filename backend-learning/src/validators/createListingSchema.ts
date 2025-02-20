import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().max(255),
  numOfBeds: z.number().int().min(1, "Number of beds must be at least 1"),
  costPerNight: z.number().min(0, "Cost per night must be positive"),
  closedForBookings: z.boolean().optional(),
  amenities: z.array(z.string().nonempty()).min(1, "At least one amenity is required"),
});