const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const BlogPost = require('./models/BlogPost');
const Coupon = require('./models/Coupon');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await BlogPost.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Database cleared.');

    // 1. Seed Users
    const admin = await User.create({
      name: 'rose & ivy Admin',
      email: 'admin@roseivy.com',
      password: 'password123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'Jane Doe',
      email: 'user@roseivy.com',
      password: 'password123',
      role: 'user',
      addresses: [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          addressLine1: 'Villa 14, Al Safa 2',
          addressLine2: 'Al Wasl Road',
          city: 'Dubai',
          country: 'United Arab Emirates',
          postalCode: '00000',
          phone: '+971501234567',
          isDefault: true
        }
      ]
    });
    console.log('Seeded Users: admin@roseivy.com & user@roseivy.com');

    // 2. Seed Categories
    const categoriesData = [
      { name: 'Flower Boxes', slug: 'flower-boxes', image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800' },
      { name: 'Signature Boxes', slug: 'signature-boxes', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80' },
      { name: 'Interior Vase Bouquets', slug: 'interior-vase-bouquets', image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&q=80&w=800' },
      { name: 'Interior Statement Pieces', slug: 'interior-statement-pieces', image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Wedding Flowers', slug: 'wedding-flowers', image: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Seasonal Collections', slug: 'seasonal-collections', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80' },
      { name: 'Gifts', slug: 'gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' },
      { name: 'Yacht & Aviation', slug: 'yacht-aviation', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80' },
      { name: 'B2B Solutions', slug: 'b2b-solutions', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Bespoke', slug: 'bespoke', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80' }
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} Categories.`);

    // Map helper
    const getCatId = (slug) => seededCategories.find(c => c.slug === slug)._id;

    // 3. Seed Products
    const productsData = [
      {
        name: 'The Parisian Dusty Rose Box',
        slug: 'parisian-dusty-rose-box',
        description: 'Our signature round box filled with luxurious bio-preserved warm dusty rose flowers that require no watering and last for a full year. Elegant, sophisticated, and perfect for displaying on any vanity or console table.',
        images: [
          'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('flower-boxes'),
        price: 550,
        salePrice: 440, // On sale
        stock: 15,
        tags: ['dusty-rose', 'signature', 'preserved'],
        variants: [
          { size: 'Classic Round', price: 550 },
          { size: 'Grand Deluxe', price: 850 }
        ],
        rating: 4.9,
        numReviews: 12
      },
      {
        name: 'Noir Velvet Preserved Roses',
        slug: 'noir-velvet-preserved-roses',
        description: 'Deep crimson velvet roses, bio-preserved at their peak and beautifully arranged in a premium black suede box. Exudes luxury and timeless passion, lasting up to a full year.',
        images: [
          'https://images.pexels.com/photos/1457800/pexels-photo-1457800.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1381679/pexels-photo-1381679.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('signature-boxes'),
        price: 650,
        stock: 8,
        tags: ['crimson', 'velvet', 'black-box'],
        variants: [
          { size: 'Standard (16 Roses)', price: 650 },
          { size: 'Imperial (36 Roses)', price: 1200 }
        ],
        rating: 4.8,
        numReviews: 19
      },
      {
        name: 'The Antique Blush Vase',
        slug: 'antique-blush-vase',
        description: 'A delicate collection of preserved eucalyptus, hydrangeas, and blush pink roses arranged in a custom ribbed ceramic antique vase. Designed to bring a touch of Parisian aesthetic into your home.',
        images: [
          'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1022928/pexels-photo-1022928.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('interior-vase-bouquets'),
        price: 450,
        stock: 20,
        tags: ['vase', 'blush', 'ceramic'],
        variants: [
          { size: 'Midi Vase', price: 450 },
          { size: 'Grand Vase', price: 700 }
        ],
        rating: 4.7,
        numReviews: 8
      },
      {
        name: 'The Grand Imperial Statement Piece',
        slug: 'grand-imperial-statement-piece',
        description: 'A striking focal arrangement featuring white hydrangeas, champagne roses, and gold-dusted foliage. Arranged in a tall luxury statement vase, ideal for foyer consoles, yacht dining tables, or corporate entrances.',
        images: [
          'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('interior-statement-pieces'),
        price: 2400,
        salePrice: 1999, // On sale
        stock: 5,
        tags: ['statement', 'premium', 'champagne', 'gold'],
        variants: [
          { size: 'Standard Imperial', price: 2400 }
        ],
        rating: 5.0,
        numReviews: 4
      },
      {
        name: 'Preserved Bridal Hand Bouquet',
        slug: 'preserved-bridal-hand-bouquet',
        description: 'An exquisite hand-tied wedding bouquet made of white David Austin roses, matching baby\'s breath, and silver eucalyptus. Specially preserved to remain a beautiful keepsake of your wedding day for a year or more.',
        images: [
          'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1457800/pexels-photo-1457800.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('wedding-flowers'),
        price: 750,
        stock: 10,
        tags: ['wedding', 'bridal', 'keepsake', 'white'],
        variants: [
          { size: 'Classic Bridal', price: 750 },
          { size: 'Luxurious Cascade', price: 1100 }
        ],
        rating: 4.9,
        numReviews: 15
      },
      {
        name: 'The Spring Blossom Basket',
        slug: 'spring-blossom-basket',
        description: 'A vibrant collection of tulips, peonies, and ranunculus in gentle pastel shades. Housed in a handmade rustic wicker basket. Brings the immediate freshness of a spring meadow indoors.',
        images: [
          'https://images.pexels.com/photos/1381679/pexels-photo-1381679.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('seasonal-collections'),
        price: 390,
        stock: 0, // Out of stock to test filter
        tags: ['spring', 'pastels', 'basket'],
        variants: [
          { size: 'Standard Basket', price: 390 }
        ],
        rating: 4.6,
        numReviews: 7
      },
      {
        name: 'Luxury Rose & Macarons Gift Set',
        slug: 'luxury-rose-macarons-gift-set',
        description: 'A rectangular drawer box featuring 9 bio-preserved pink roses in the top tier and a drawer at the bottom filled with 12 fresh Ladurée vanilla and raspberry macarons. An unforgettable luxury gift.',
        images: [
          'https://images.pexels.com/photos/1022928/pexels-photo-1022928.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('gifts'),
        price: 480,
        stock: 12,
        tags: ['gift-set', 'macarons', 'pink-roses'],
        variants: [
          { size: 'Rose & Macarons Set', price: 480 }
        ],
        rating: 4.9,
        numReviews: 22
      },
      {
        name: 'The IN BLOOM Gift Card',
        slug: 'in-bloom-gift-card',
        description: 'Give the gift of choice. Our premium digital gift cards can be redeemed against any of our bio-preserved rose boxes, custom vase bouquets, or bespoke flower creations. Delivered instantly by email.',
        images: [
          'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=900',
          'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=900'
        ],
        category: getCatId('gifts'),
        price: 200, // Default price, though custom is supported
        stock: 9999,
        tags: ['gift-card', 'digital'],
        variants: [
          { size: 'Digital Card', price: 200 }
        ],
        rating: 5.0,
        numReviews: 31
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} Products.`);

    // 4. Seed BlogPosts
    const blogsData = [
      {
        title: 'The Art of Preserving Nature: How We Do It',
        slug: 'art-of-preserving-nature-how-we-do-it',
        content: '<p>Bio-preservation is a scientific and artistic process that replaces the natural sap inside freshly cut flowers with a proprietary blend of glycerine and organic dyes. Unlike dried flowers, which are brittle and faded, bio-preserved flowers remain soft, supple, and perfectly radiant for an entire year.</p><p>We source our premium roses from the fertile volcanic soils of Ecuador at their absolute peak of bloom. Our local boutique team ensures that each arrangement is built with meticulous details, keeping the aesthetic standard of high-end French floristry.</p>',
        image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        category: 'Floral Care',
        author: 'Marie Rose'
      },
      {
        title: 'Caring For Your Preserved Rose Box: 3 Simple Rules',
        slug: 'caring-for-your-preserved-rose-box',
        content: '<p>Although rose & ivy flower arrangements require virtually no maintenance, follow these three simple guidelines to ensure they look beautiful for the full 365 days:</p><ol><li><strong>Do NOT water them:</strong> Water will damage the preservation formula and cause colors to run.</li><li><strong>Avoid direct sunlight:</strong> Long periods of sunlight can fade the organic dyes.</li><li><strong>Keep in a dry space:</strong> High humidity (e.g. bathrooms) should be avoided to prevent sap sweating.</li></ol>',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
        category: 'Guides',
        author: 'Jean-Luc'
      },
      {
        title: 'Decorating Luxury Spaces: Floral Statement Pieces',
        slug: 'decorating-luxury-spaces-floral-statement-pieces',
        content: '<p>In interior design, flowers act as a living sculpture. For yacht salons, private aviation cabins, and modern penthouses, choosing statement preserved arrangements adds immediate warmth without the constant maintenance cycle of fresh-cut bouquets.</p><p>Opt for warm dusty roses, deep crimsons, and champagne tones to blend naturally with marble surfaces and warm wooden paneling.</p>',
        image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=800&q=80',
        category: 'Inspiration',
        author: 'Sophia Al-Mansoori'
      }
    ];

    const seededBlogs = await BlogPost.insertMany(blogsData);
    console.log(`Seeded ${seededBlogs.length} Blog Posts.`);

    // 5. Seed Coupons
    const couponsData = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrder: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 100
      },
      {
        code: 'ROSE20',
        discountType: 'percentage',
        discountValue: 20,
        minOrder: 300,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        usageLimit: 50
      },
      {
        code: 'DXB50',
        discountType: 'fixed',
        discountValue: 50,
        minOrder: 200,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usageLimit: 200
      }
    ];

    const seededCoupons = await Coupon.insertMany(couponsData);
    console.log(`Seeded ${seededCoupons.length} Discount Coupons.`);

    console.log('Seeded ${seededCoupons.length} Discount Coupons.');

    console.log('Seeding completed successfully!');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Error with data import:', error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
