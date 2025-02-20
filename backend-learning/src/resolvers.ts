import { Resolvers } from "./types";
import { validateFullAmenities } from "./helpers";
import { createListingSchema } from "./validators/createListingSchema";
import { z } from "zod";

export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListing(id)
    }
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingAPI.getAmenities(id)
    },
  },
  Mutation: {
    createListing: async (_, { input }, { dataSources }) => {
      try {
        createListingSchema.parse(input);
  
        const response = await dataSources.listingAPI.createListing(input)

        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: response,
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          const validationErrors = err.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message,
          }))

          return {
            code: 400,
            success: false,
            message: "Validation failed",
            errors: validationErrors,
            listing: null,
          }
        }

        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${err.extensions.response.body}`,
          errors: [],
          listing: null,
        };
      }
    }
  }
};