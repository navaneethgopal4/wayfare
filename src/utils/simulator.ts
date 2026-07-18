import { Trip, Day, Stop } from './storage';

// Helper to generate a random ID
const uuid = () => Math.random().toString(36).substring(2, 11);

// Standard mock trips
const LISBON_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '5 Relaxed Days in Lisbon',
  description: 'A curated slow-travel guide to Lisbon\'s historic neighborhoods, viewpoints, and delicious food stops.',
  days: [
    {
      dayNumber: 1,
      title: 'Historic Alfama & Castelo',
      stops: [
        {
          id: 'lisbon-d1-s1',
          time: '09:30 AM',
          title: 'Breakfast at Augusto Lisboa',
          category: 'Food',
          duration: '60 min',
          description: 'A cozy spot for artisanal toast, avocado eggs, and freshly squeezed orange juice.',
          location: 'Rua de Santa Marinha 26, 1100-489 Lisboa'
        },
        {
          id: 'lisbon-d1-s2',
          time: '11:00 AM',
          title: 'Wander Alfama\'s Alleyways',
          category: 'Sight',
          duration: '90 min',
          description: 'Explore the labyrinthine cobblestone streets, colorful tiles, and laundry hanging from balconies.',
          location: 'Alfama, Lisbon'
        },
        {
          id: 'lisbon-d1-s3',
          time: '01:00 PM',
          title: 'Lunch at Prado',
          category: 'Food',
          duration: '90 min',
          description: 'Farm-to-table dining celebrating seasonal Portuguese ingredients in a gorgeous, plant-filled space.',
          location: 'Travessa das Pedras Negras 2, 1100-404 Lisboa'
        },
        {
          id: 'lisbon-d1-s4',
          time: '03:00 PM',
          title: 'Miradouro da Senhora do Monte',
          category: 'Sight',
          duration: '45 min',
          description: 'The highest viewpoint in Lisbon. Offers breathtaking panoramic views over the city and castle.',
          location: 'Largo Monte, 1170-107 Lisboa'
        },
        {
          id: 'lisbon-d1-s5',
          time: '04:30 PM',
          title: 'Castelo de S. Jorge',
          category: 'Sight',
          duration: '90 min',
          description: 'Stroll the pine-shaded ramparts of the historic moorish fortress overlooking the Tagus river.',
          location: 'Rua de Santa Cruz do Castelo, 1100-129 Lisboa'
        },
        {
          id: 'lisbon-d1-s6',
          time: '07:30 PM',
          title: 'Fado & Dinner at Tasca do Chico',
          category: 'Activity',
          duration: '120 min',
          description: 'Enjoy traditional petiscos (tapas) while listening to soul-stirring live amateur Fado music.',
          location: 'R. do Diário de Notícias 39, 1200-141 Lisboa'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Baixa, Chiado & Bairro Alto',
      stops: [
        {
          id: 'lisbon-d2-s1',
          time: '09:00 AM',
          title: 'Pastel de Nata at Manteigaria',
          category: 'Food',
          duration: '30 min',
          description: 'Taste the best pastel de nata in town. Watch them make the crispy pastry shell and warm custard.',
          location: 'Rua do Loreto 2, 1200-108 Lisboa'
        },
        {
          id: 'lisbon-d2-s2',
          time: '10:00 AM',
          title: 'Rua Augusta Arch & Praça do Comércio',
          category: 'Sight',
          duration: '60 min',
          description: 'Stroll down Baixa\'s main pedestrian street, walk under the triumphal arch, and stand in the grand waterfront square.',
          location: 'Praça do Comércio, 1100-148 Lisboa'
        },
        {
          id: 'lisbon-d2-s3',
          time: '11:30 AM',
          title: 'Historic Tram 28 Ride',
          category: 'Activity',
          duration: '45 min',
          description: 'Hop on the famous vintage yellow tram for a scenic, clattering ride through Lisbon\'s steepest hills.',
          location: 'Martim Moniz (Tram Stop), Lisbon'
        },
        {
          id: 'lisbon-d2-s4',
          time: '01:00 PM',
          title: 'Lunch at Time Out Market',
          category: 'Food',
          duration: '90 min',
          description: 'A buzzing historic food hall gathering Lisbon\'s top chefs, seafood mongers, and dessert spots under one roof.',
          location: 'Av. 24 de Julho 49, 1200-479 Lisboa'
        },
        {
          id: 'lisbon-d2-s5',
          time: '03:00 PM',
          title: 'Carmo Convent Ruins',
          category: 'Sight',
          duration: '60 min',
          description: 'A striking gothic church left roofless after the historic 1755 earthquake, now housing an archaeological museum.',
          location: 'Largo do Carmo, 1200-092 Lisboa'
        },
        {
          id: 'lisbon-d2-s6',
          time: '05:00 PM',
          title: 'Shopping at Livraria Bertrand',
          category: 'Shopping',
          duration: '45 min',
          description: 'Browse books in the world\'s oldest operating bookstore, serving readers since 1732.',
          location: 'R. Garrett 73 75, 1200-203 Lisboa'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Belem\'s Maritime History',
      stops: [
        {
          id: 'lisbon-d3-s1',
          time: '09:30 AM',
          title: 'Pastéis de Belém',
          category: 'Food',
          duration: '45 min',
          description: 'The birthplace of the Portuguese egg tart. Eat them warm with cinnamon and powdered sugar.',
          location: 'R. de Belém 84-92, 1300-085 Lisboa'
        },
        {
          id: 'lisbon-d3-s2',
          time: '10:30 AM',
          title: 'Jerónimos Monastery',
          category: 'Sight',
          duration: '90 min',
          description: 'Marvel at the stunning Manueline architecture and intricate stonework in this UNESCO World Heritage cloister.',
          location: 'Praça do Império 1400-206 Lisboa'
        },
        {
          id: 'lisbon-d3-s3',
          time: '12:30 PM',
          title: 'Discoveries Monument',
          category: 'Sight',
          duration: '30 min',
          description: 'Walk along the waterfront to inspect the massive ship-shaped stone monument honoring Portugal\'s age of exploration.',
          location: 'Av. Brasília, 1400-038 Lisboa'
        },
        {
          id: 'lisbon-d3-s4',
          time: '01:30 PM',
          title: 'Seafood Lunch at O Frade',
          category: 'Food',
          duration: '90 min',
          description: 'A tiny, modern tavern with counter seating offering refined Alentejo dishes and incredible petiscos.',
          location: 'Calçada da Ajuda 14, 1300-015 Lisboa'
        },
        {
          id: 'lisbon-d3-s5',
          time: '03:30 PM',
          title: 'Belém Tower',
          category: 'Sight',
          duration: '60 min',
          description: 'A fortified 16th-century stone tower standing directly in the Tagus river bank.',
          location: 'Av. Brasília, 1400-038 Lisboa'
        },
        {
          id: 'lisbon-d3-s6',
          time: '06:00 PM',
          title: 'Sunset Tagus River Cruise',
          category: 'Activity',
          duration: '120 min',
          description: 'Board a small sailing yacht for a sunset tour of the river, floating under the 25th of April Bridge.',
          location: 'Doca de Belém, Lisbon'
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Day Trip to Sintra',
      stops: [
        {
          id: 'lisbon-d4-s1',
          time: '09:00 AM',
          title: 'Train from Rossio to Sintra',
          category: 'Transit',
          duration: '45 min',
          description: 'Take the scenic, direct train ride from central Lisbon up to the forested hills of Sintra.',
          location: 'Estação do Rossio, Lisbon'
        },
        {
          id: 'lisbon-d4-s2',
          time: '10:00 AM',
          title: 'Pena Palace',
          category: 'Sight',
          duration: '120 min',
          description: 'Explore the colorful, romanticist fairytale palace perched on a mountain ridge surrounded by lush parklands.',
          location: 'Estrada da Pena, 2710-609 Sintra'
        },
        {
          id: 'lisbon-d4-s3',
          time: '01:00 PM',
          title: 'Lunch at Incomum by Luis Santos',
          category: 'Food',
          duration: '90 min',
          description: 'Refined contemporary Portuguese cuisine in Sintra town, with elegant plating and great wine pairings.',
          location: 'R. Dr. Alfredo da Costa 22, 2710-524 Sintra'
        },
        {
          id: 'lisbon-d4-s4',
          time: '03:00 PM',
          title: 'Quinta da Regaleira',
          category: 'Sight',
          duration: '120 min',
          description: 'Descend the mystical, 9-story spiral "Initiation Well" and wander secret mossy tunnels and stone towers.',
          location: 'R. Visc. de Monserrate, 2710-618 Sintra'
        },
        {
          id: 'lisbon-d4-s5',
          time: '05:30 PM',
          title: 'Queijadas at Casa Piriquita',
          category: 'Food',
          duration: '30 min',
          description: 'Treat yourself to Sintra\'s traditional sweet cheese tarts (queijadas) and puff pastries (travesseiros).',
          location: 'R. das Padarias 1, 2710-603 Sintra'
        },
        {
          id: 'lisbon-d4-s6',
          time: '06:15 PM',
          title: 'Return Train to Lisbon',
          category: 'Transit',
          duration: '45 min',
          description: 'Sit back and relax on the train back to Rossio station in central Lisbon.',
          location: 'Sintra Train Station, Sintra'
        }
      ]
    },
    {
      dayNumber: 5,
      title: 'Art, Modernity & Tagus Riverfront',
      stops: [
        {
          id: 'lisbon-d5-s1',
          time: '10:00 AM',
          title: 'Calouste Gulbenkian Museum',
          category: 'Sight',
          duration: '120 min',
          description: 'View a world-class private art collection spanning Egyptian antiquities, Rembrandt, and Lalique jewelry, set in modern gardens.',
          location: 'Av. de Berna 45A, 1067-001 Lisboa'
        },
        {
          id: 'lisbon-d5-s2',
          time: '12:30 PM',
          title: 'Stroll Gulbenkian Gardens',
          category: 'Activity',
          duration: '45 min',
          description: 'Relax by the ponds, watch the ducks, and enjoy the architectural concrete details of this mid-century park.',
          location: 'Rua Dr. Nicolau de Bettencourt, 1050-078 Lisboa'
        },
        {
          id: 'lisbon-d5-s3',
          time: '01:30 PM',
          title: 'Lunch at Avo Torta',
          category: 'Food',
          duration: '75 min',
          description: 'Delicious traditional food presented in a modern, casual bistro styling.',
          location: 'Rua de São Bento 244, 1250-219 Lisboa'
        },
        {
          id: 'lisbon-d5-s4',
          time: '03:15 PM',
          title: 'LX Factory Creative Hub',
          category: 'Shopping',
          duration: '90 min',
          description: 'Browse quirky boutiques, art installations, and the iconic Ler Devagar bookstore in a repurposed 19th-century industrial complex.',
          location: 'R. Rodrigues de Faria 103, 1300-501 Lisboa'
        },
        {
          id: 'lisbon-d5-s5',
          time: '05:00 PM',
          title: 'MAAT Museum & Rooftop Walk',
          category: 'Sight',
          duration: '60 min',
          description: 'Walk on top of the wave-shaped, tile-clad Museum of Art, Architecture and Technology for waterfront views.',
          location: 'Av. Brasília, 1300-598 Lisboa'
        },
        {
          id: 'lisbon-d5-s6',
          time: '07:30 PM',
          title: 'Farewell Dinner at Taberna da Rua das Flores',
          category: 'Food',
          duration: '120 min',
          description: 'Small, chalkboard-menu tavern serving incredible creative plates of traditional food in an old tavern space.',
          location: 'Rua das Flores 103, 1200-194 Lisboa'
        }
      ]
    }
  ]
};

const TOKYO_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '3-Day Solo Food Trip to Tokyo',
  description: 'An intensive culinary journey through Tokyo\'s best ramen shops, sushi stalls, street food alleys, and traditional izakayas.',
  days: [
    {
      dayNumber: 1,
      title: 'Neon, Ramen & Izakaya Alleyways',
      stops: [
        {
          id: 'tokyo-d1-s1',
          time: '09:00 AM',
          title: 'Tsukiji Outer Market Food Crawl',
          category: 'Food',
          duration: '120 min',
          description: 'Sample sweet tamagoyaki (omelet), fresh sea urchin, grilled wagyu skewers, and strawberry mochi.',
          location: '4-chome-16-2 Tsukiji, Chuo City, Tokyo'
        },
        {
          id: 'tokyo-d1-s2',
          time: '11:30 AM',
          title: 'Coffee at Turret Coffee',
          category: 'Food',
          duration: '45 min',
          description: 'Enjoy a rich, velvety latte from one of Tokyo\'s most respected specialty coffee shops near Tsukiji.',
          location: '2-chome-12-6 Tsukiji, Chuo City, Tokyo'
        },
        {
          id: 'tokyo-d1-s3',
          time: '01:00 PM',
          title: 'Ramen Street Lunch (Rokurinsha)',
          category: 'Food',
          duration: '60 min',
          description: 'Savor rich, thick tsukemen (dipping noodles) in the basement of Tokyo Station. Worth the queue!',
          location: '1-chome-9-1 Marunouchi, Chiyoda City, Tokyo'
        },
        {
          id: 'tokyo-d1-s4',
          time: '03:00 PM',
          title: 'Shopping in Akihabara Electric Town',
          category: 'Shopping',
          duration: '120 min',
          description: 'Browse multi-story retro game shops, electronics departments, and anime merchandise centers.',
          location: 'Sotokanda, Chiyoda City, Tokyo'
        },
        {
          id: 'tokyo-d1-s5',
          time: '06:00 PM',
          title: 'Omoide Yokocho Izakaya Walk',
          category: 'Activity',
          duration: '90 min',
          description: 'Squeeze into a tiny stall in "Memory Lane" for charcoal-grilled yakitori and a cold beer among the smoke and neon.',
          location: '1-chome-2 Nishi-Shinjuku, Shinjuku City, Tokyo'
        },
        {
          id: 'tokyo-d1-s6',
          time: '08:30 PM',
          title: 'Golden Gai Bar Hopping',
          category: 'Activity',
          duration: '120 min',
          description: 'Explore the narrow pathways housing over 200 micro-bars, each holding just 4 to 8 people.',
          location: '1-chome-1-6 Kabukicho, Shinjuku City, Tokyo'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Pop Culture & High-End Dinings',
      stops: [
        {
          id: 'tokyo-d2-s1',
          time: '10:00 AM',
          title: 'Crepes & Street Snacks in Harajuku',
          category: 'Food',
          duration: '60 min',
          description: 'Walk down Takeshita Street and treat yourself to a giant rolled cream crepe or rainbow cheese toast.',
          location: '1-chome Jingumae, Shibuya City, Tokyo'
        },
        {
          id: 'tokyo-d2-s2',
          time: '11:30 AM',
          title: 'Meiji Jingu Shrine Stroll',
          category: 'Sight',
          duration: '60 min',
          description: 'Walk through massive wooden torii gates into a tranquil cedar forest housing Tokyo\'s most famous shrine.',
          location: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo'
        },
        {
          id: 'tokyo-d2-s3',
          time: '01:00 PM',
          title: 'Tonkatsu at Tonkatsu Maisen Aoyama',
          category: 'Food',
          duration: '75 min',
          description: 'Enjoy incredibly tender, breaded, deep-fried pork cutlets served with sweet sauce in a former bathhouse.',
          location: '4-chome-8-5 Jingumae, Shibuya City, Tokyo'
        },
        {
          id: 'tokyo-d2-s4',
          time: '03:00 PM',
          title: 'Shibuya Crossing & Shibuya Sky',
          category: 'Sight',
          duration: '90 min',
          description: 'Cross the world\'s busiest intersection, then ascend to Shibuya Sky for 360-degree open-air city views.',
          location: '2-chome-24-12 Shibuya, Shibuya City, Tokyo'
        },
        {
          id: 'tokyo-d2-s5',
          time: '05:30 PM',
          title: 'Loft Department Store Shopping',
          category: 'Shopping',
          duration: '60 min',
          description: 'Browse multiple floors of beautiful stationery, home goods, cosmetics, and quirky Japanese designs.',
          location: '21-1 Udagawacho, Shibuya City, Tokyo'
        },
        {
          id: 'tokyo-d2-s6',
          time: '07:30 PM',
          title: 'Standing Sushi at Uogashi Nihon-ichi',
          category: 'Food',
          duration: '60 min',
          description: 'Stand at the counter and order fresh, chef-prepared nigiri sushi piece by piece, served on a bamboo leaf.',
          location: '25-6 Udagawacho, Shibuya City, Tokyo'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Traditional Asakusa & Craft Beer',
      stops: [
        {
          id: 'tokyo-d3-s1',
          time: '09:30 AM',
          title: 'Nakamise Shopping Street & Senso-ji',
          category: 'Sight',
          duration: '90 min',
          description: 'Snack on fresh melonpan (sweet bread) and ningyo-yaki (filled cakes) on your way to the ancient red temple.',
          location: '2-chome-3-1 Asakusa, Taito City, Tokyo'
        },
        {
          id: 'tokyo-d3-s2',
          time: '11:30 AM',
          title: 'Kitchenware Shopping in Kappabashi',
          category: 'Shopping',
          duration: '90 min',
          description: 'Explore Tokyo\'s restaurant supply street, famous for hand-forged chef knives and ultra-realistic wax food models.',
          location: 'Matsugaya, Taito City, Tokyo'
        },
        {
          id: 'tokyo-d3-s3',
          time: '01:30 PM',
          title: 'Soba Lunch at Namiki Yabusoba',
          category: 'Food',
          duration: '60 min',
          description: 'Dine at a legendary shop serving cold buckwheat soba noodles with a highly concentrated, savory dipping broth.',
          location: '2-chome-11-9 Kaminarimon, Taito City, Tokyo'
        },
        {
          id: 'tokyo-d3-s4',
          time: '03:00 PM',
          title: 'Stroll along Sumida River Park',
          category: 'Activity',
          duration: '60 min',
          description: 'Walk along the river bank with views of the futuristic Tokyo Skytree and the Asahi Flame building.',
          location: '1-chome Hanakawado, Taito City, Tokyo'
        },
        {
          id: 'tokyo-d3-s5',
          time: '05:00 PM',
          title: 'Hoppy Street Izakaya',
          category: 'Food',
          duration: '90 min',
          description: 'Have a drink of Hoppy (beer-flavored beverage mixed with shochu) and enjoy stewed beef tendon (gyusuji nikomi) at an outdoor street table.',
          location: '2-chome-3 Asakusa, Taito City, Tokyo'
        },
        {
          id: 'tokyo-d3-s6',
          time: '07:30 PM',
          title: 'Craft Beer at Baird Taproom Harajuku',
          category: 'Food',
          duration: '90 min',
          description: 'Celebrate the end of your trip with a flight of local Japanese craft beers paired with yakitori.',
          location: '1-chome-20-13 Jingumae, Shibuya City, Tokyo'
        }
      ]
    }
  ]
};

const BARCELONA_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: 'Weekend in Barcelona: Gaudí & Tapas',
  description: 'A romantic 2-day itinerary centered around Antoni Gaudí\'s whimsical architecture and delicious Catalan tapas spots.',
  days: [
    {
      dayNumber: 1,
      title: 'Modernism & Gothic Quarters',
      stops: [
        {
          id: 'bcn-d1-s1',
          time: '09:00 AM',
          title: 'Brunch at El Flako',
          category: 'Food',
          duration: '60 min',
          description: 'A colorful, trendy cafe in Born offering beautiful cereal bowls, eggs benedict, and matchas.',
          location: 'Carrer del General Álvarez de Castro 5, 08003 Barcelona'
        },
        {
          id: 'bcn-d1-s2',
          time: '10:15 AM',
          title: 'Explore the Gothic Quarter',
          category: 'Sight',
          duration: '90 min',
          description: 'Wander the narrow medieval lanes, visit the Cathedral of Barcelona, and cross under Pont del Bisbe.',
          location: 'Barri Gòtic, Barcelona'
        },
        {
          id: 'bcn-d1-s3',
          time: '12:00 PM',
          title: 'Casa Batlló Tour',
          category: 'Sight',
          duration: '90 min',
          description: 'Tour Gaudí\'s masterpiece on Passeig de Gràcia, famous for its marine-inspired facade and skull-shaped balconies.',
          location: 'Passeig de Gràcia 43, 08007 Barcelona'
        },
        {
          id: 'bcn-d1-s4',
          time: '02:00 PM',
          title: 'Tapas Lunch at Cervecería Catalana',
          category: 'Food',
          duration: '90 min',
          description: 'Enjoy some of the best tapas in Barcelona, including montaditos, patatas bravas, and grilled razor clams.',
          location: 'Carrer de Mallorca 236, 08008 Barcelona'
        },
        {
          id: 'bcn-d1-s5',
          time: '04:00 PM',
          title: 'La Pedrera (Casa Milà)',
          category: 'Sight',
          duration: '75 min',
          description: 'Marvel at Gaudí\'s undulating stone building and climb up to the roof to see the iconic warrior-shaped chimneys.',
          location: 'Passeig de Gràcia 92, 08008 Barcelona'
        },
        {
          id: 'bcn-d1-s6',
          time: '08:30 PM',
          title: 'Dinner at El Xampanyet',
          category: 'Food',
          duration: '90 min',
          description: 'Stand at the busy counter of this historic tavern for house-cured anchovies, padron peppers, and homemade cava.',
          location: 'Carrer de Montcada 22, 08003 Barcelona'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Sagrada Família & Park Güell',
      stops: [
        {
          id: 'bcn-d2-s1',
          time: '09:00 AM',
          title: 'Sagrada Família Guided Entry',
          category: 'Sight',
          duration: '120 min',
          description: 'Enter Gaudí\'s towering, unfinished basilica and watch the morning sun create rainbow light pools through the stained-glass windows.',
          location: 'Carrer de Mallorca 401, 08013 Barcelona'
        },
        {
          id: 'bcn-d2-s2',
          time: '11:30 AM',
          title: 'Park Güell Monumental Zone',
          category: 'Sight',
          duration: '90 min',
          description: 'Walk among the colorful mosaic salamander, the undulating serpentine bench, and the stone viaducts overlooking the sea.',
          location: 'Carrer de Larrard, 08024 Barcelona'
        },
        {
          id: 'bcn-d2-s3',
          time: '01:30 PM',
          title: 'Lunch at Terraza Martínez',
          category: 'Food',
          duration: '120 min',
          description: 'A beautiful restaurant on Montjuïc hill offering spectacular views of the harbor and delicious traditional seafood paella.',
          location: 'Carretera de Miramar 38, 08038 Barcelona'
        },
        {
          id: 'bcn-d2-s4',
          time: '04:00 PM',
          title: 'Walk Rambla del Poblenou to Beach',
          category: 'Activity',
          duration: '90 min',
          description: 'Stroll down Poblenou\'s local tree-lined boulevard, browse small shops, and walk down to Bogatell Beach.',
          location: 'Rambla del Poblenou, Barcelona'
        },
        {
          id: 'bcn-d2-s5',
          time: '06:00 PM',
          title: 'Drinks at Chiringuito Escribà',
          category: 'Food',
          duration: '60 min',
          description: 'Relax with a glass of sangria directly on the beach, enjoying the sea breeze and waves.',
          location: 'Avinguda del Litoral 62, 08005 Barcelona'
        },
        {
          id: 'bcn-d2-s6',
          time: '08:30 PM',
          title: 'Tapas & Vermouth at Quimet & Quimet',
          category: 'Food',
          duration: '90 min',
          description: 'A tiny, standing-room-only vermouth bar lined with bottles from floor to ceiling, famous for gourmet canned seafood tapas (conservas).',
          location: 'Carrer de Poeta Cabanyes 25, 08004 Barcelona'
        }
      ]
    }
  ]
};

// ==========================================
// Indian Travel Templates & Mocks
// ==========================================

const GOA_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '3 Days Sunny Beach Escape to Goa',
  description: 'Relax on beautiful sandy beaches, explore historic Portuguese forts, and savor authentic Goan fish curry.',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: North Goa Beaches & Forts',
      stops: [
        {
          id: 'goa-d1-s1',
          time: '09:00 AM',
          title: 'Breakfast at German Bakery Anjuna',
          category: 'Food',
          duration: '60 min',
          description: 'Enjoy delicious organic breakfast, fresh juices, and croissants in a relaxed garden setting.',
          location: 'Anjuna, Goa'
        },
        {
          id: 'goa-d1-s2',
          time: '10:30 AM',
          title: 'Explore Fort Aguada',
          category: 'Sight',
          duration: '90 min',
          description: 'Visit the 17th-century Portuguese lighthouse and fort, offering stunning panoramic ocean views.',
          location: 'Sinquerim, Candolim, Goa'
        },
        {
          id: 'goa-d1-s3',
          time: '01:00 PM',
          title: 'Goan Thali at Ritz Classic',
          category: 'Food',
          duration: '90 min',
          description: 'Savor an authentic Goan fish curry thali with fresh prawns, crab, and local fried fish.',
          location: 'Panaji, Goa'
        },
        {
          id: 'goa-d1-s4',
          time: '03:30 PM',
          title: 'Relax at Vagator Beach',
          category: 'Activity',
          duration: '120 min',
          description: 'Walk along the dramatic red cliffs of Vagator and view the famous Shiva carving on the beach.',
          location: 'Vagator, Goa'
        },
        {
          id: 'goa-d1-s5',
          time: '06:00 PM',
          title: 'Sunset at Chapora Fort',
          category: 'Sight',
          duration: '90 min',
          description: 'Trek up to the iconic fort ruins (famous from Dil Chahta Hai movie) to watch a gorgeous sunset over the sea.',
          location: 'Chapora, Goa'
        },
        {
          id: 'goa-d1-s6',
          time: '08:30 PM',
          title: 'Beachside Dinner at Curlies Shack',
          category: 'Food',
          duration: '120 min',
          description: 'Dine with your toes in the sand, listening to waves, and enjoying tandoori seafood and cocktails.',
          location: 'Anjuna Beach, Goa'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Day 2: South Goa Heritage & Spices',
      stops: [
        {
          id: 'goa-d2-s1',
          time: '09:30 AM',
          title: 'Basilica of Bom Jesus',
          category: 'Sight',
          duration: '90 min',
          description: 'Visit the UNESCO world heritage site holding the mortal remains of St. Francis Xavier.',
          location: 'Old Goa, Goa'
        },
        {
          id: 'goa-d2-s2',
          time: '11:30 AM',
          title: 'Tropical Spice Plantation Tour',
          category: 'Activity',
          duration: '120 min',
          description: 'Take a guided walk among cardamom, black pepper, and vanilla vines, followed by a traditional buffet lunch served on banana leaves.',
          location: 'Ponda, Goa'
        },
        {
          id: 'goa-d2-s3',
          time: '02:30 PM',
          title: 'Mangeshi Temple Visit',
          category: 'Sight',
          duration: '60 min',
          description: 'Visit the beautiful, historic Hindu temple dedicated to Lord Shiva, famous for its elegant tower.',
          location: 'Mangeshi, Goa'
        },
        {
          id: 'goa-d2-s4',
          time: '04:30 PM',
          title: 'Stroll Colva Beach',
          category: 'Activity',
          duration: '90 min',
          description: 'Walk along the endless white sands of South Goa, enjoying a quieter beach atmosphere.',
          location: 'Colva, Goa'
        },
        {
          id: 'goa-d2-s5',
          time: '07:30 PM',
          title: 'Dinner at Martin\'s Corner',
          category: 'Food',
          duration: '120 min',
          description: 'Famous restaurant serving incredible pork vindaloo, butter garlic crabs, and live Goan music.',
          location: 'Betalbatim, South Goa, Goa'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Day 3: Panaji Latin Quarter & Cruise',
      stops: [
        {
          id: 'goa-d3-s1',
          time: '10:00 AM',
          title: 'Stroll Fontainhas Latin Quarter',
          category: 'Sight',
          duration: '90 min',
          description: 'Walk through narrow streets of brightly colored Portuguese-style heritage houses and cozy art cafes.',
          location: 'Fontainhas, Panaji, Goa'
        },
        {
          id: 'goa-d3-s2',
          time: '12:00 PM',
          title: 'Lunch at Confeitaria 31 De Janeiro',
          category: 'Food',
          duration: '60 min',
          description: 'Visit one of Panaji\'s oldest bakeries for traditional beef patties, fish cutlets, and local bebinca dessert.',
          location: 'Fontainhas, Panaji, Goa'
        },
        {
          id: 'goa-d3-s3',
          time: '01:30 PM',
          title: 'Immaculate Conception Church',
          category: 'Sight',
          duration: '60 min',
          description: 'Admire the famous white baroque zig-zag stairs of this landmark historic church in central Panaji.',
          location: 'Panaji, Goa'
        },
        {
          id: 'goa-d3-s4',
          time: '03:00 PM',
          title: 'Shopping at Panjim Municipal Market',
          category: 'Shopping',
          duration: '90 min',
          description: 'Buy local Goan cashews, spices, hand-woven handicrafts, and traditional Goa feni liquor.',
          location: 'Panaji, Goa'
        },
        {
          id: 'goa-d3-s5',
          time: '05:30 PM',
          title: 'Mandovi River Sunset Cruise',
          category: 'Activity',
          duration: '90 min',
          description: 'Board a river cruise to watch a scenic sunset while enjoying traditional Goan folk dances and music.',
          location: 'Panaji Jetty, Goa'
        }
      ]
    }
  ]
};

const MUMBAI_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '3 Days in Mumbai — City of Dreams',
  description: 'Experience Mumbai\'s iconic Victorian heritage, bustling local trains, legendary street food, and peaceful sunsets at Marine Drive.',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: South Mumbai Heritage & Gateway',
      stops: [
        {
          id: 'mumbai-d1-s1',
          time: '09:00 AM',
          title: 'Breakfast at Kyani & Co.',
          category: 'Food',
          duration: '60 min',
          description: 'A legendary 100-year-old Irani cafe. Try bun maska, double half-fry eggs, and Irani chai.',
          location: 'Metro Junction, Marine Lines, Mumbai'
        },
        {
          id: 'mumbai-d1-s2',
          time: '10:30 AM',
          title: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
          category: 'Sight',
          duration: '45 min',
          description: 'Marvel at the stunning Gothic Revival architecture of this UNESCO world heritage railway station.',
          location: 'Fort, Mumbai'
        },
        {
          id: 'mumbai-d1-s3',
          time: '11:45 AM',
          title: 'Gateway of India & Taj Mahal Palace',
          category: 'Sight',
          duration: '60 min',
          description: 'Stand before the iconic stone arch overlooking the Arabian Sea, right next to the historic Taj Hotel.',
          location: 'Apollo Bandar, Colaba, Mumbai'
        },
        {
          id: 'mumbai-d1-s4',
          time: '01:00 PM',
          title: 'Lunch at Cafe Leopold',
          category: 'Food',
          duration: '90 min',
          description: 'A bustling multi-cuisine landmark in Colaba. Popular for beer, Chinese, and Indian plates.',
          location: 'Colaba Causeway, Mumbai'
        },
        {
          id: 'mumbai-d1-s5',
          time: '03:00 PM',
          title: 'Shopping at Colaba Causeway',
          category: 'Shopping',
          duration: '90 min',
          description: 'Browse the famous street stalls for silver jewelry, handicrafts, shoes, and vintage items.',
          location: 'Colaba, Mumbai'
        },
        {
          id: 'mumbai-d1-s6',
          time: '05:30 PM',
          title: 'Sunset at Marine Drive',
          category: 'Activity',
          duration: '120 min',
          description: 'Sit on the concrete promenade (Queen\'s Necklace) and watch a gorgeous sunset over the Arabian Sea.',
          location: 'Netaji Subhash Chandra Bose Road, Mumbai'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Day 2: Bandra Vibe & Elephanta Caves',
      stops: [
        {
          id: 'mumbai-d2-s1',
          time: '09:00 AM',
          title: 'Ferry to Elephanta Caves',
          category: 'Transit',
          duration: '90 min',
          description: 'Catch a scenic boat ride from the Gateway of India to Gharapuri Island.',
          location: 'Gateway of India, Mumbai'
        },
        {
          id: 'mumbai-d2-s2',
          time: '10:30 AM',
          title: 'Explore Elephanta Caves',
          category: 'Sight',
          duration: '120 min',
          description: 'Walk through ancient 5th-century rock-cut temples dedicated to Lord Shiva, featuring the massive Trimurti sculpture.',
          location: 'Elephanta Island, Mumbai'
        },
        {
          id: 'mumbai-d2-s3',
          time: '01:30 PM',
          title: 'Lunch at Britannia & Co.',
          category: 'Food',
          duration: '90 min',
          description: 'Historic Parsi restaurant famous for its legendary Berry Pulav and caramel custard.',
          location: 'Ballard Estate, Fort, Mumbai'
        },
        {
          id: 'mumbai-d2-s4',
          time: '03:30 PM',
          title: 'Drive across Bandra-Worli Sea Link',
          category: 'Transit',
          duration: '30 min',
          description: 'Take a taxi across the magnificent 8-lane cable-stayed bridge over the sea, linking south and suburbs.',
          location: 'Sea Link, Mumbai'
        },
        {
          id: 'mumbai-d2-s5',
          time: '04:30 PM',
          title: 'Wander Bandra Bandstand',
          category: 'Activity',
          duration: '90 min',
          description: 'Walk along the seaside promenade, view the celebrity houses (like SRK\'s Mannat), and see the historic Bandra Fort ruins.',
          location: 'Bandra West, Mumbai'
        },
        {
          id: 'mumbai-d2-s6',
          time: '07:30 PM',
          title: 'Dinner at Joey\'s Pizza or Elco Pani Puri',
          category: 'Food',
          duration: '90 min',
          description: 'Treat yourself to Mumbai\'s best street chaat or local fusion pizza.',
          location: 'Bandra, Mumbai'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Day 3: Local Culture & Street Food',
      stops: [
        {
          id: 'mumbai-d3-s1',
          time: '10:00 AM',
          title: 'Haji Ali Dargah',
          category: 'Sight',
          duration: '90 min',
          description: 'Walk across the narrow pathway in the middle of the sea to visit the famous 15th-century mosque.',
          location: 'Lala Lajpatrai Marg, Mumbai'
        },
        {
          id: 'mumbai-d3-s2',
          time: '12:00 PM',
          title: 'Lunch at Sardar Refreshments',
          category: 'Food',
          duration: '60 min',
          description: 'Taste the ultimate, buttery Mumbai Pav Bhaji served with soft warm buns.',
          location: 'Tardeo, Mumbai'
        },
        {
          id: 'mumbai-d3-s3',
          time: '02:00 PM',
          title: 'Dharavi Local Industry Tour',
          category: 'Activity',
          duration: '120 min',
          description: 'Take a respectful guided walking tour of Dharavi\'s leather, plastic recycling, and pottery workshops.',
          location: 'Dharavi, Mumbai'
        },
        {
          id: 'mumbai-d3-s4',
          time: '04:30 PM',
          title: 'Siddhivinayak Temple Visit',
          category: 'Sight',
          duration: '60 min',
          description: 'Visit Mumbai\'s most famous temple dedicated to Lord Ganesha.',
          location: 'Prabhadevi, Mumbai'
        },
        {
          id: 'mumbai-d3-s5',
          time: '06:00 PM',
          title: 'Street Food Crawl at Chowpatty Beach',
          category: 'Food',
          duration: '120 min',
          description: 'Sample local street bites: Vada Pav, Sev Puri, Bhel Puri, and spicy Ragda Pattice on the beach sand.',
          location: 'Girgaon Chowpatty, Mumbai'
        }
      ]
    }
  ]
};

const DELHI_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '3 Days Golden Triangle: Delhi Heritage',
  description: 'Explore the grand historic monuments of Delhi, Old Delhi\'s legendary street food, and bustling traditional bazaars.',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: Old Delhi Heritage & Street Food',
      stops: [
        {
          id: 'delhi-d1-s1',
          time: '09:30 AM',
          title: 'Breakfast at Jalebi Wala',
          category: 'Food',
          duration: '45 min',
          description: 'Start with piping hot, thick, syrupy jalebis fried in pure ghee, a 150-year-old tradition.',
          location: 'Chandni Chowk, Old Delhi'
        },
        {
          id: 'delhi-d1-s2',
          time: '10:30 AM',
          title: 'Explore Red Fort (Lal Qila)',
          category: 'Sight',
          duration: '120 min',
          description: 'Tour the massive 17th-century red sandstone fortress built by Mughal Emperor Shah Jahan.',
          location: 'Netaji Subhash Marg, New Delhi'
        },
        {
          id: 'delhi-d1-s3',
          time: '01:00 PM',
          title: 'Mughlai Lunch at Karim\'s',
          category: 'Food',
          duration: '90 min',
          description: 'Savor legendary mutton seekh kebabs, butter chicken, and fresh tandoori roti near Jama Masjid.',
          location: 'Gali Kababian, Jama Masjid, Old Delhi'
        },
        {
          id: 'delhi-d1-s4',
          time: '02:30 PM',
          title: 'Visit Jama Masjid',
          category: 'Sight',
          duration: '60 min',
          description: 'One of the largest mosques in India, featuring grand black-and-white marble domes and minarets.',
          location: 'Chandni Chowk, Old Delhi'
        },
        {
          id: 'delhi-d1-s5',
          time: '04:00 PM',
          title: 'Rickshaw Ride in Chandni Chowk',
          category: 'Transit',
          duration: '60 min',
          description: 'Take a thrilling cycle-rickshaw ride through the narrow lanes of the spice market (Khari Baoli) and wedding bazaar.',
          location: 'Chandni Chowk, Old Delhi'
        },
        {
          id: 'delhi-d1-s6',
          time: '06:00 PM',
          title: 'Kulfi at Giani\'s di Hatti',
          category: 'Food',
          duration: '45 min',
          description: 'Indulge in traditional creamy Rabri Falooda kulfi dessert.',
          location: 'Church Mission Road, Fatehpuri, Delhi'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Day 2: Imperial Monuments of New Delhi',
      stops: [
        {
          id: 'delhi-d2-s1',
          time: '09:00 AM',
          title: 'Walk around India Gate',
          category: 'Sight',
          duration: '60 min',
          description: 'Visit the grand stone arch war memorial and stroll along the green lawns of Rajpath.',
          location: 'Rajpath, New Delhi'
        },
        {
          id: 'delhi-d2-s2',
          time: '10:30 AM',
          title: 'Humayun\'s Tomb Visit',
          category: 'Sight',
          duration: '90 min',
          description: 'Explore the spectacular 16th-century garden tomb of the Mughal Emperor Humayun, which inspired the Taj Mahal.',
          location: 'Nizamuddin East, New Delhi'
        },
        {
          id: 'delhi-d2-s3',
          time: '01:00 PM',
          title: 'Lunch at Connaught Place (CP)',
          category: 'Food',
          duration: '90 min',
          description: 'Dine in Delhi\'s colonial shopping circle. Try North Indian dishes at Wenger\'s or United Coffee House.',
          location: 'Connaught Place, New Delhi'
        },
        {
          id: 'delhi-d2-s4',
          time: '03:00 PM',
          title: 'Shopping at Janpath Market',
          category: 'Shopping',
          duration: '90 min',
          description: 'Shop for ethnic clothing, silver jewelry, leather bags, and traditional Tibetan artifacts.',
          location: 'Janpath, New Delhi'
        },
        {
          id: 'delhi-d2-s5',
          time: '05:00 PM',
          title: 'Qutub Minar Complex',
          category: 'Sight',
          duration: '90 min',
          description: 'Marvel at the 73-meter tall red sandstone tower built in 1193, surrounded by ancient ruins and the rust-free Iron Pillar.',
          location: 'Mehrauli, New Delhi'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Day 3: Spiritual Heritage & Modern Cafes',
      stops: [
        {
          id: 'delhi-d3-s1',
          time: '09:30 AM',
          title: 'Lotus Temple Stroll',
          category: 'Sight',
          duration: '60 min',
          description: 'Visit the striking lotus-shaped Bahai House of Worship, designed for silent meditation and prayer.',
          location: 'Kalkaji, New Delhi'
        },
        {
          id: 'delhi-d3-s2',
          time: '11:00 AM',
          title: 'National Crafts Museum',
          category: 'Sight',
          duration: '90 min',
          description: 'Observe traditional terracotta horses, carved wooden doors, and weavers demonstrating ethnic crafts.',
          location: 'Pragati Maidan, New Delhi'
        },
        {
          id: 'delhi-d3-s3',
          time: '01:00 PM',
          title: 'Lunch at Cafe Lota',
          category: 'Food',
          duration: '90 min',
          description: 'An elegant open-air museum cafe serving creative, modern twists on regional Indian dishes.',
          location: 'Crafts Museum, Pragati Maidan, New Delhi'
        },
        {
          id: 'delhi-d3-s4',
          time: '03:00 PM',
          title: 'Champa Gali Creative Stroll',
          category: 'Activity',
          duration: '90 min',
          description: 'Explore a hidden, cobblestone alleyway in Saket filled with design studios, coffee roasters, and fairy lights.',
          location: 'Saidulajab, Saket, New Delhi'
        },
        {
          id: 'delhi-d3-s5',
          time: '05:30 PM',
          title: 'Bangla Sahib Gurudwara Sunset',
          category: 'Activity',
          duration: '90 min',
          description: 'Sit by the peaceful golden-domed Sikh temple\'s massive holy pool (sarovar) and observe the mega community kitchen.',
          location: 'Ashoka Road, Connaught Place, New Delhi'
        }
      ]
    }
  ]
};

const KERALA_TRIP: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> = {
  title: '3 Days Serene Kerala Escape',
  description: 'Experience God\'s Own Country: colonial Fort Kochi heritage, lush Munnar tea gardens, and the relaxing Alleppey backwater houseboats.',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: Colonial Fort Kochi Heritage',
      stops: [
        {
          id: 'kerala-d1-s1',
          time: '09:00 AM',
          title: 'Breakfast at Kashi Art Cafe',
          category: 'Food',
          duration: '60 min',
          description: 'Enjoy fresh organic scrambled eggs, homemade bread, and coffee in a gallery-styled courtyard.',
          location: 'Burger Street, Fort Kochi, Kochi'
        },
        {
          id: 'kerala-d1-s2',
          time: '10:30 AM',
          title: 'Chinese Fishing Nets Stroll',
          category: 'Sight',
          duration: '90 min',
          description: 'See the massive cantilevered wooden fishing nets, introduced by Chinese traders in the 14th century.',
          location: 'Fort Kochi Beach, Kochi'
        },
        {
          id: 'kerala-d1-s3',
          time: '01:00 PM',
          title: 'Kerala Fish Curry Meals at Oceanos',
          category: 'Food',
          duration: '90 min',
          description: 'Taste spicy Kerala fish pollichathu (baked in banana leaf) served with local red rice.',
          location: 'Elphinstone Road, Fort Kochi, Kochi'
        },
        {
          id: 'kerala-d1-s4',
          time: '03:00 PM',
          title: 'Mattancherry Palace & Jew Town',
          category: 'Sight',
          duration: '120 min',
          description: 'Visit the Portuguese "Dutch Palace" containing beautiful murals of Hindu epics, then browse antique shops.',
          location: 'Jew Town, Mattancherry, Kochi'
        },
        {
          id: 'kerala-d1-s5',
          time: '06:00 PM',
          title: 'Kathakali Dance Show',
          category: 'Activity',
          duration: '90 min',
          description: 'Watch a traditional Kathakali dance-drama performance, including the elaborate face-painting process beforehand.',
          location: 'Kerala Kathakali Centre, Fort Kochi'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Day 2: Tea Hills of Munnar',
      stops: [
        {
          id: 'kerala-d2-s1',
          time: '09:00 AM',
          title: 'Scenic Drive to Munnar',
          category: 'Transit',
          duration: '180 min',
          description: 'Enjoy a beautiful, winding road trip up to the Western Ghats, passing cascading waterfalls and pine forests.',
          location: 'Kochi-Munnar Highway, Kerala'
        },
        {
          id: 'kerala-d2-s2',
          time: '01:00 PM',
          title: 'Lunch at Saravana Bhavan Munnar',
          category: 'Food',
          duration: '60 min',
          description: 'Savor quick, delicious South Indian paper dosas and filter coffee.',
          location: 'Munnar Town, Kerala'
        },
        {
          id: 'kerala-d2-s3',
          time: '02:30 PM',
          title: 'Walk Munnar Tea Plantations',
          category: 'Sight',
          duration: '120 min',
          description: 'Stroll through endless rows of manicured green tea bushes and capture beautiful mist-filled valley views.',
          location: 'Lockhart Tea Estate, Munnar, Kerala'
        },
        {
          id: 'kerala-d2-s4',
          time: '05:00 PM',
          title: 'Visit Munnar Tea Museum',
          category: 'Activity',
          duration: '60 min',
          description: 'Learn about the history of tea processing in India, watching vintage machinery in action.',
          location: 'Nallathanni Estate, Munnar, Kerala'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Day 3: Alleppey Backwaters Houseboat',
      stops: [
        {
          id: 'kerala-d3-s1',
          time: '09:00 AM',
          title: 'Drive to Alleppey Backwaters',
          category: 'Transit',
          duration: '150 min',
          description: 'Drive down to the serene coastal town of Alappuzha, the Venice of the East.',
          location: 'Alleppey, Kerala'
        },
        {
          id: 'kerala-d3-s2',
          time: '11:45 AM',
          title: 'Board Traditional Houseboat',
          category: 'Activity',
          duration: '300 min',
          description: 'Settle into a traditional bamboo-and-thatch houseboat to cruise the peaceful lagoons, canals, and coconut groves.',
          location: 'Alleppey Jetty, Kerala'
        },
        {
          id: 'kerala-d3-s3',
          time: '01:30 PM',
          title: 'On-Board Karimeen Thali Lunch',
          category: 'Food',
          duration: '90 min',
          description: 'Enjoy fresh, chef-cooked pearl spot fish curry, red rice, cabbage thoran, and payasam dessert on the boat.',
          location: 'Alleppey Houseboat, Kerala'
        },
        {
          id: 'kerala-d3-s4',
          time: '05:00 PM',
          title: 'Sunset over Vembanad Lake',
          category: 'Sight',
          duration: '60 min',
          description: 'Relax on the deck as the sun sets over India\'s longest lake, bathing the palms in golden orange light.',
          location: 'Vembanad Lake, Alleppey, Kerala'
        }
      ]
    }
  ]
};

// Generic mock templates to generate a trip dynamically if search doesn't match predefined ones
const SIGHT_MOCKS = [
  { title: 'Historic Old Town Square', desc: 'Stroll through the historic center, admiring the classical architecture and local street performers.' },
  { title: 'Panoramic City Viewpoint', desc: 'Ascend to a high viewpoint to capture stunning photos of the skyline and surrounding landscapes.' },
  { title: 'National Art Gallery & Museum', desc: 'Wander through collections of classical and contemporary art in a beautifully designed museum.' },
  { title: 'Botanical Gardens & Glasshouse', desc: 'Relax amidst paths of rare tropical plants, water lilies, and historic iron-frame glasshouses.' },
  { title: 'Cathedral / Grand Landmark', desc: 'Marvel at the dramatic vaulting, stained-glass details, and historical crypt of the city\'s main cathedral.' }
];

const FOOD_MOCKS = [
  { title: 'Coffee at Local Roasters', desc: 'Start the day with fresh pour-over coffee, house-baked pastries, and a cozy local atmosphere.' },
  { title: 'Traditional Lunch Spot', desc: 'Dine on iconic local specialties and regional wines at a beloved family-owned tavern.' },
  { title: 'Trendy Food Hall & Market', desc: 'Explore diverse food counters gathering the city\'s top culinary artisans and fresh seafood stalls.' },
  { title: 'Cozy Afternoon Bakery', desc: 'Indulge in sweet local cakes, traditional desserts, and freshly brewed herbal teas.' },
  { title: 'Farewell Tasting Dinner', desc: 'Savor a multi-course tasting menu exploring modern takes on traditional cooking styles.' }
];

const ACTIVITY_MOCKS = [
  { title: 'Guided Walking History Tour', desc: 'Learn about the ancient origins, wars, and legends of the neighborhood from a local expert.' },
  { title: 'Sunset Boat / River Cruise', desc: 'Float along the waterways, catching views of illuminated bridges and shoreline landmarks at dusk.' },
  { title: 'Local Cooking / Craft Workshop', desc: 'Get hands-on experience crafting traditional souvenirs or cooking local specialties under instruction.' },
  { title: 'Bicycle / Scooter City Tour', desc: 'Cover more ground with a scenic cycle path tour along the river and through central parks.' }
];

const SHOPPING_MOCKS = [
  { title: 'Artisanal Craft Market', desc: 'Browse handmade jewelry, hand-painted tiles, ceramics, and local textiles from independent creators.' },
  { title: 'Historic Street Bookstore', desc: 'Browse rare editions, art books, and translation selections in a gorgeous historic shop.' },
  { title: 'Local Boutique Alleyways', desc: 'Discover unique clothing lines, vintage accessories, and niche local designs.' }
];

const TRANSIT_MOCKS = [
  { title: 'Scenic Train / Tram Ride', desc: 'Sit back and enjoy the scenery during a comfortable local transit journey.' },
  { title: 'Ferry Crossing', desc: 'Catch the boat to cross the harbor, offering breezy sea views and a fresh perspective on the city.' }
];

export async function simulateTripGeneration(prompt: string): Promise<Trip> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const lower = prompt.toLowerCase();
  let baseTrip: Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'>;

  if (lower.includes('lisbon')) {
    baseTrip = LISBON_TRIP;
  } else if (lower.includes('tokyo')) {
    baseTrip = TOKYO_TRIP;
  } else if (lower.includes('barcelona')) {
    baseTrip = BARCELONA_TRIP;
  } else if (lower.includes('goa')) {
    baseTrip = GOA_TRIP;
  } else if (lower.includes('mumbai') || lower.includes('bombay')) {
    baseTrip = MUMBAI_TRIP;
  } else if (lower.includes('delhi')) {
    baseTrip = DELHI_TRIP;
  } else if (lower.includes('kerala')) {
    baseTrip = KERALA_TRIP;
  } else {
    // Parse duration and destination dynamically from prompt
    let daysCount = 3;
    const dayMatch = prompt.match(/(\d+)\s*day/i);
    if (dayMatch) {
      daysCount = Math.max(1, Math.min(10, parseInt(dayMatch[1])));
    }

    // Attempt to extract destination name
    let destination = 'New Destination';
    const inMatch = prompt.match(/to\s+([A-Za-z\s]+)/i) || prompt.match(/in\s+([A-Za-z\s]+)/i) || prompt.match(/trip\s+([A-Za-z\s]+)/i);
    if (inMatch) {
      destination = inMatch[1].trim().split(' ')[0]; // Take first word to keep it clean
      destination = destination.charAt(0).toUpperCase() + destination.slice(1);
    } else {
      const words = prompt.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(' ');
      // Handle short domestic names like Goa (length 3)
      const candidate = words.find(w => w.length >= 3 && !['days', 'trip', 'relaxed', 'solo', 'with', 'plan', 'days'].includes(w.toLowerCase()));
      if (candidate) {
        destination = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    // Localized Indian prompt flag
    const isIndianPrompt = 
      lower.includes('india') || 
      lower.includes('mumbai') || 
      lower.includes('delhi') || 
      lower.includes('goa') || 
      lower.includes('kerala') || 
      lower.includes('bangalore') || 
      lower.includes('kolkata') || 
      lower.includes('chennai') || 
      lower.includes('jaipur') || 
      lower.includes('agra') || 
      lower.includes('taj') || 
      lower.includes('local') ||
      ['goa', 'delhi', 'kochi', 'pune'].some(city => lower.includes(city));

    let sightMocks = SIGHT_MOCKS;
    let foodMocks = FOOD_MOCKS;
    let activityMocks = ACTIVITY_MOCKS;
    let shoppingMocks = SHOPPING_MOCKS;
    let transitMocks = TRANSIT_MOCKS;

    if (isIndianPrompt) {
      sightMocks = [
        { title: 'Historic Heritage Palace', desc: 'Explore the stunning arches, intricate carvings, and royal history of this ancient heritage monument.' },
        { title: 'Ancient Temple & Spiritual Center', desc: 'Visit a historic temple, absorbing the peaceful chanting, sweet incense, and beautiful traditional architecture.' },
        { title: 'Bustling Local Viewpoint', desc: 'Look out over the sprawling city skyline, colorful streets, and landmark landscapes.' },
        { title: 'UNESCO Archaeological Ruins', desc: 'Wander through ancient ruins, stone-cut caves, and carvings dating back hundreds of years.' }
      ];
      foodMocks = [
        { title: 'Famous Street Food Crawl', desc: 'Sample legendary street delicacies: hot samosas, spicy chaat, crispy vadas, and local sweets.' },
        { title: 'Traditional Thali Lunch', desc: 'Savor a massive regional thali served on banana leaves with diverse curries, rice, and flatbreads.' },
        { title: 'Masala Chai Stall Stop', desc: 'Stop at a roadside tea stall for piping hot masala cutting chai brewed with cardamom and ginger.' },
        { title: 'Authentic Local Diner', desc: 'Dine at a historic local restaurant serving traditional tandoori dishes, butter chicken, or local biryani.' }
      ];
      activityMocks = [
        { title: 'Guided Walking Heritage Tour', desc: 'Wander through historical lanes and learn about the local culture, struggles, and dynastic history.' },
        { title: 'Sunset Boat / River Cruise', desc: 'Float along the river or coast, catching breezy views of active fishing boats and ancient sea forts.' },
        { title: 'Traditional Craft Workshop', desc: 'Watch local weavers, potters, or spice merchants practice their historic trades.' }
      ];
      shoppingMocks = [
        { title: 'Bustling Spice & Tea Bazaar', desc: 'Explore narrow bazaar alleyways filled with sacks of cardamom, saffron, turmeric, and local teas.' },
        { title: 'Traditional Handloom & Saree Shop', desc: 'Browse colorful hand-woven silks, cotton kurtas, and traditional textiles directly from weavers.' }
      ];
      transitMocks = [
        { title: 'Auto-Rickshaw Ride', desc: 'Experience a thrilling, breezy ride through the city\'s traffic in a traditional yellow-and-black auto-rickshaw.' },
        { title: 'Scenic Heritage Train Journey', desc: 'Enjoy countryside views on a local railway journey crossing bridges and tunnels.' }
      ];
    }

    const days: Day[] = [];
    const categories: Stop['category'][] = ['Food', 'Sight', 'Food', 'Sight', 'Shopping', 'Activity'];
    const times = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:30 PM', '08:00 PM'];
    const durations = ['60 min', '90 min', '90 min', '60 min', '45 min', '120 min'];

    for (let d = 1; d <= daysCount; d++) {
      const stops: Stop[] = [];
      const dayThemes = ['Highlights & Central Landmarks', 'Culture, Art & Local Neighborhoods', 'Hidden Gems & Waterfront Views', 'Parks, Recreation & Dining Crawls', 'Day Trip Adventure'];
      const dayTheme = dayThemes[(d - 1) % dayThemes.length];

      for (let s = 0; s < 6; s++) {
        const cat = categories[s];
        let mockDetails = { title: 'Stop Title', desc: 'Description of the stop' };
        
        if (cat === 'Sight') {
          mockDetails = sightMocks[Math.floor(Math.random() * sightMocks.length)];
        } else if (cat === 'Food') {
          mockDetails = foodMocks[Math.floor(Math.random() * foodMocks.length)];
        } else if (cat === 'Activity') {
          mockDetails = activityMocks[Math.floor(Math.random() * activityMocks.length)];
        } else if (cat === 'Shopping') {
          mockDetails = shoppingMocks[Math.floor(Math.random() * shoppingMocks.length)];
        } else {
          mockDetails = transitMocks[Math.floor(Math.random() * transitMocks.length)];
        }

        stops.push({
          id: `sim-${d}-${s}-${uuid()}`,
          time: times[s],
          title: `${mockDetails.title} in ${destination}`,
          category: cat,
          duration: durations[s],
          description: mockDetails.desc,
          location: `123 Main Street, ${destination}`
        });
      }

      days.push({
        dayNumber: d,
        title: `Day ${d}: ${dayTheme}`,
        stops
      });
    }

    baseTrip = {
      title: `${daysCount} Days in ${destination}`,
      description: `A custom-generated simulated itinerary for your trip to ${destination}. (Server API key was not configured, running in Demo Fallback Mode).`,
      days
    };
  }

  return {
    ...baseTrip,
    id: `trip-${uuid()}`,
    createdAt: new Date().toISOString(),
    originalPrompt: prompt
  };
}

export async function simulateTripRefinement(currentTrip: Trip, refinementPrompt: string): Promise<Trip> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Clone current trip
  const updated = JSON.parse(JSON.stringify(currentTrip)) as Trip;

  // Append a notification to description that it was refined
  updated.description = `${updated.description} (Refined: "${refinementPrompt}" applied in simulation mode)`;

  // Add a custom stop or modify something in response to common keywords
  const lower = refinementPrompt.toLowerCase();
  if (lower.includes('food') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('eat')) {
    // Add a food stop to day 1 or 2
    if (updated.days.length > 0) {
      const day = updated.days[0];
      day.stops.push({
        id: `refined-food-${uuid()}`,
        time: '06:00 PM',
        title: 'Special Local Food Tasting (Refinement)',
        category: 'Food',
        duration: '90 min',
        description: `A unique dining experience added in response to your request: "${refinementPrompt}"`,
        location: 'Culinary Lane, Center'
      });
      // Sort or re-order stops (simplistic order helper)
      day.stops = reorderTimes(day.stops);
    }
  } else if (lower.includes('museum') || lower.includes('art') || lower.includes('culture') || lower.includes('sight')) {
    if (updated.days.length > 0) {
      const day = updated.days[Math.min(updated.days.length - 1, 1)]; // Day 2 if exists
      day.stops.push({
        id: `refined-culture-${uuid()}`,
        time: '02:30 PM',
        title: 'Art Gallery & Heritage Center (Refinement)',
        category: 'Sight',
        duration: '90 min',
        description: `Explore local heritage and modern exhibitions. Added for: "${refinementPrompt}"`,
        location: 'Culture Plaza 45'
      });
      day.stops = reorderTimes(day.stops);
    }
  } else {
    // Generic stop addition
    if (updated.days.length > 0) {
      const day = updated.days[0];
      day.stops.push({
        id: `refined-gen-${uuid()}`,
        time: '04:00 PM',
        title: 'Custom Stop: Shaped by your request',
        category: 'Activity',
        duration: '60 min',
        description: `This stop was custom-inserted by AI simulator in response to your request: "${refinementPrompt}"`,
        location: 'Central Plaza'
      });
      day.stops = reorderTimes(day.stops);
    }
  }

  // Recalculate stop times to be nice
  return updated;
}

function reorderTimes(stops: Stop[]): Stop[] {
  const times = ['09:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '06:00 PM', '08:00 PM'];
  return stops.map((stop, idx) => ({
    ...stop,
    time: times[idx] || stop.time
  }));
}
