import DataLoader from 'dataloader';
import { RESTDataSource } from "@apollo/datasource-rest";
import { Listing, Amenity, CreateListingInput } from "../types"

export class ListingAPI extends RESTDataSource {
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";

  private batchAmenities = new DataLoader(
    async (listingIds): Promise<Amenity[][]> => {
      const amenitiesList = await this.get<Amenity[][]>('amenities/listings', {
        params: {
          ids: listingIds.join(',')
        }
      });

      return amenitiesList;
    }
  );

  getFeaturedListings(): Promise<Listing[]> {
    return this.get<Listing[]>("featured-listings");
  }

  getListing(listingId: string): Promise<Listing> {
    return this.get<Listing>(`listings/${listingId}`)
  }

  getAmenities(listingId: string): Promise<Amenity[]> {
    return this.batchAmenities.load(listingId);
  }

  createListing(listing: CreateListingInput): Promise<Listing> {
    return this.post<Listing>('listings', {
      body: { listing }
    })
  }
}