import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source.js';
import { Agent } from '../agents/entities/agent.entity.js';
import { Property, FacilitiesType, PropertyType } from '../properties/entities/property.entity.js';
import { Review } from '../reviews/entities/review.entity.js';
import { AuthProvider, User } from '../users/entities/user.entity.js';

const seedDataSource = new DataSource({
  ...dataSourceOptions,
  entities: [User, Agent, Property, Review],
});

const agentSeeds = [
  {
    name: 'Harbor & Hill Realty',
    email: 'harbor-hill@example.test',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    userEmail: 'agent.harbor@example.test',
  },
  {
    name: 'Juniper Homes',
    email: 'juniper-homes@example.test',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    userEmail: 'agent.juniper@example.test',
  },
];

const userSeeds = [
  { name: 'Alex Morgan', email: 'reviewer.alex@example.test', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' },
  { name: 'Jamie Rivera', email: 'reviewer.jamie@example.test', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
  { name: 'Taylor Chen', email: 'reviewer.taylor@example.test', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
  { name: 'Riley Brooks', email: 'reviewer.riley@example.test', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
  { name: 'Jordan Patel', email: 'reviewer.jordan@example.test', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
  { name: 'Casey Nguyen', email: 'reviewer.casey@example.test', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
  { name: 'Avery Thompson', email: 'reviewer.avery@example.test', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { name: 'Morgan Ellis', email: 'reviewer.morgan@example.test', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
  { name: 'Quinn Davis', email: 'reviewer.quinn@example.test', photo: 'https://images.unsplash.com/photo-1504591833609-a0b760a07e7?w=400' },
  { name: 'Drew Wilson', email: 'reviewer.drew@example.test', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400' },
  { name: 'Harbor Agent', email: 'agent.harbor@example.test', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
  { name: 'Juniper Agent', email: 'agent.juniper@example.test', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
];

const propertySeeds = [
  {
    name: 'Cliffside House',
    type: PropertyType.HOUSE,
    description: 'A bright coastal home with open living spaces and expansive ocean views.',
    address: '18 Seaview Road, La Jolla, CA',
    price: 1450000,
    area: 212,
    bedrooms: 4,
    bathrooms: 3,
    facilities: [FacilitiesType.PARKING, FacilitiesType.WIFI, FacilitiesType.PET_FRIENDLY],
    image: 'https://images.unsplash.com/photo-1600597687939-ce8a6c25118c?w=1200',
    galleries: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
    ],
    geolocation: '32.8328,-117.2713',
    agentEmail: agentSeeds[0].email,
  },
  {
    name: 'Cedar Loft',
    type: PropertyType.APARTMENT,
    description: 'A calm, light-filled apartment close to neighborhood cafes and transit.',
    address: '402 Cedar Street, Portland, OR',
    price: 585000,
    area: 96,
    bedrooms: 2,
    bathrooms: 2,
    facilities: [FacilitiesType.GYM, FacilitiesType.LAUNDRY, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    galleries: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    ],
    geolocation: '45.5231,-122.6765',
    agentEmail: agentSeeds[1].email,
  },
  {
    name: 'Garden Townhouse',
    type: PropertyType.TOWN_HOUSE,
    description: 'A modern townhouse with a private garden and a flexible work-from-home nook.',
    address: '77 Maple Avenue, Austin, TX',
    price: 735000,
    area: 148,
    bedrooms: 3,
    bathrooms: 2,
    facilities: [FacilitiesType.PARKING, FacilitiesType.LAUNDRY, FacilitiesType.PET_FRIENDLY],
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
    galleries: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
    ],
    geolocation: '30.2672,-97.7431',
    agentEmail: agentSeeds[0].email,
  },
  {
    name: 'Mosswood Retreat',
    type: PropertyType.VILLA,
    description: 'A secluded villa with mature trees, generous natural light, and a quiet patio.',
    address: '12 Fernwood Lane, Asheville, NC',
    price: 925000,
    area: 186,
    bedrooms: 3,
    bathrooms: 2,
    facilities: [FacilitiesType.PARKING, FacilitiesType.PET_FRIENDLY, FacilitiesType.LAUNDRY],
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'],
    geolocation: '35.5951,-82.5515',
    agentEmail: agentSeeds[1].email,
  },
  {
    name: 'Brickline Duplex',
    type: PropertyType.DUPLEX,
    description: 'A thoughtfully updated duplex with separate living zones and a shared courtyard.',
    address: '205 Fulton Street, Denver, CO',
    price: 810000,
    area: 174,
    bedrooms: 4,
    bathrooms: 3,
    facilities: [FacilitiesType.PARKING, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200'],
    geolocation: '39.7392,-104.9903',
    agentEmail: agentSeeds[0].email,
  },
  {
    name: 'Parkview Condo',
    type: PropertyType.CONDO,
    description: 'A compact city condo overlooking a leafy park, with a well-planned open kitchen.',
    address: '88 West Elm Street, Chicago, IL',
    price: 465000,
    area: 82,
    bedrooms: 2,
    bathrooms: 1,
    facilities: [FacilitiesType.GYM, FacilitiesType.LAUNDRY, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'],
    geolocation: '41.8781,-87.6298',
    agentEmail: agentSeeds[1].email,
  },
  {
    name: 'Sunroom Studio',
    type: PropertyType.STUDIO,
    description: 'An efficient studio with tall windows, built-in storage, and a sunny breakfast corner.',
    address: '31 Willow Court, Seattle, WA',
    price: 329000,
    area: 54,
    bedrooms: 1,
    bathrooms: 1,
    facilities: [FacilitiesType.LAUNDRY, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200'],
    geolocation: '47.6062,-122.3321',
    agentEmail: agentSeeds[0].email,
  },
  {
    name: 'Maple Family Home',
    type: PropertyType.HOUSE,
    description: 'A comfortable family home with a fenced yard, roomy kitchen, and flexible guest room.',
    address: '640 Maple Drive, Raleigh, NC',
    price: 692000,
    area: 163,
    bedrooms: 4,
    bathrooms: 2,
    facilities: [FacilitiesType.PARKING, FacilitiesType.PET_FRIENDLY, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200'],
    geolocation: '35.7796,-78.6382',
    agentEmail: agentSeeds[1].email,
  },
  {
    name: 'Riverside Apartment',
    type: PropertyType.APARTMENT,
    description: 'A relaxed apartment near the river trail with a generous balcony and shared fitness room.',
    address: '9 Riverwalk Way, Sacramento, CA',
    price: 518000,
    area: 103,
    bedrooms: 2,
    bathrooms: 2,
    facilities: [FacilitiesType.GYM, FacilitiesType.PARKING, FacilitiesType.PET_FRIENDLY],
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'],
    geolocation: '38.5816,-121.4944',
    agentEmail: agentSeeds[0].email,
  },
  {
    name: 'Juniper Ridge Townhouse',
    type: PropertyType.TOWN_HOUSE,
    description: 'A modern end-unit townhouse with mountain views and a private two-car garage.',
    address: '115 Juniper Ridge, Salt Lake City, UT',
    price: 649000,
    area: 139,
    bedrooms: 3,
    bathrooms: 2,
    facilities: [FacilitiesType.PARKING, FacilitiesType.LAUNDRY, FacilitiesType.WIFI],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    galleries: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200'],
    geolocation: '40.7608,-111.8910',
    agentEmail: agentSeeds[1].email,
  },
];

const reviewComments = [
  'The rooms were bright and the layout made excellent use of the space.',
  'A lovely place in a convenient neighborhood. The listing details were accurate.',
  'Well maintained, comfortable, and easy to imagine making a home here.',
  'The natural light and thoughtful details stood out during the visit.',
  'Great location with a practical floor plan and plenty of useful amenities.',
  'The property was clean, welcoming, and presented exactly as described.',
  'A comfortable home with a quiet atmosphere and a very usable kitchen.',
  'The outdoor space and nearby services make this a particularly appealing option.',
  'Good proportions throughout and a neighborhood that is easy to get around.',
  'A polished, well cared-for property with a lot of character.',
];

async function syncPropertyRatings(): Promise<number> {
  const propertyRepository = seedDataSource.getRepository(Property);
  const reviewRepository = seedDataSource.getRepository(Review);

  const properties = await propertyRepository.find({ relations: { reviews: true } });

  let updatedCount = 0;

  for (const property of properties) {
    const reviews = await reviewRepository.find({ where: { property: { id: property.id } } });
    const ratings = reviews.map((review) => Number(review.rating)).filter((value) => !Number.isNaN(value));

    const nextRating = ratings.length
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(2))
      : 0;

    if (property.rating !== nextRating) {
      property.rating = nextRating;
      await propertyRepository.save(property);
      updatedCount += 1;
    }
  }

  return updatedCount;
}

async function seed(): Promise<void> {
  await seedDataSource.initialize();

  try {
    const userRepository = seedDataSource.getRepository(User);
    const agentRepository = seedDataSource.getRepository(Agent);
    const propertyRepository = seedDataSource.getRepository(Property);
    const reviewRepository = seedDataSource.getRepository(Review);

    const usersByEmail = new Map<string, User>();
    let insertedUsers = 0;
    for (const seedUser of userSeeds) {
      let user = await userRepository.findOneBy({ email: seedUser.email });
      if (!user) {
        user = userRepository.create({
          name: seedUser.name,
          email: seedUser.email,
          photo: seedUser.photo,
          password: "aPass",
          googleId: null,
          provider: AuthProvider.LOCAL,
          isEmailVerified: true,
        });
        user = await userRepository.save(user);
        insertedUsers += 1;
      }
      usersByEmail.set(seedUser.email, user);
    }

    const agentsByEmail = new Map<string, Agent>();
    for (const seedAgent of agentSeeds) {
      let agent = await agentRepository.findOneBy({ email: seedAgent.email });
      if (!agent) {
        agent = agentRepository.create({
          name: seedAgent.name,
          email: seedAgent.email,
          avatar: seedAgent.avatar,
          user: usersByEmail.get(seedAgent.userEmail)!,
        });
        agent = await agentRepository.save(agent);
      }
      agentsByEmail.set(seedAgent.email, agent);
    }

    const properties: Property[] = [];
    for (const seedProperty of propertySeeds) {
      let property = await propertyRepository.findOne({
        where: { name: seedProperty.name, address: seedProperty.address },
      });
      if (!property) {
        const { agentEmail, ...propertyFields } = seedProperty;
        const agent = agentsByEmail.get(agentEmail);
        if (!agent) {
          throw new Error(`Seed agent not found for property: ${seedProperty.name}`);
        }
        property = propertyRepository.create({ ...propertyFields, agent });
        property = await propertyRepository.save(property);
      }
      properties.push(property);
    }

    let insertedReviews = 0;
    for (const [index, property] of properties.entries()) {
      for (const offset of [0, 1]) {
        const reviewerSeedIndex = (index * 2 + offset) % reviewComments.length;
        const reviewerSeed = userSeeds[reviewerSeedIndex];
        const reviewer = usersByEmail.get(reviewerSeed.email)!;
        const reviewText = reviewComments[reviewerSeedIndex];
        const existingReview = await reviewRepository.findOne({
          where: { review: reviewText, property: { id: property.id }, user: { id: reviewer.id } },
        });
        if (!existingReview) {
          const review = reviewRepository.create({
            name: reviewer.name,
            avatar: reviewer.photo ?? '',
            review: reviewText,
            rating: reviewerSeedIndex % 3 === 0 ? 5 : 4,
            property,
            user: reviewer,
          });
          await reviewRepository.save(review);
          insertedReviews += 1;
        }
      }
    }

    const updatedRatings = await syncPropertyRatings();

    console.info(
      `Seed complete: ${insertedUsers} users inserted, ${agentSeeds.length} agents available, ${properties.length} properties available, ${insertedReviews} reviews inserted, ${updatedRatings} properties updated with ratings.`,
    );
  } finally {
    await seedDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
