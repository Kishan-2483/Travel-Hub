<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        Listing::truncate();

        $places = [
            "Taj Mahal" => ['lat' => 27.1751, 'lng' => 78.0421, 'id' => '1524492412937-b28074a5d7da'],
            "Goa" => ['lat' => 15.2993, 'lng' => 74.1240, 'id' => '1512343879784-a960bf40e7f2'],
            "Jaipur" => ['lat' => 26.9124, 'lng' => 75.7873, 'id' => '1598324789736-4861f89564a0'],
            "Manali" => ['lat' => 32.2396, 'lng' => 77.1887, 'id' => '1506461883276-59b1e967a57a'],
            "Leh" => ['lat' => 34.1526, 'lng' => 77.5771, 'id' => '1476514525535-07fb3b4ae5f1'],
            "Golden Temple" => ['lat' => 31.6200, 'lng' => 74.8765, 'id' => '1564507592227-cb84b196e862'],
            "Shimla" => ['lat' => 31.1048, 'lng' => 77.1734, 'id' => '1469854523086-cc02fe5d8800'],
            "Udaipur" => ['lat' => 24.5854, 'lng' => 73.7125, 'id' => '1587478640470-a20d4e73b22e'],
            "Varanasi" => ['lat' => 25.3176, 'lng' => 82.9739, 'id' => '1587478640470-a20d4e73b22e'],
            "Srinagar" => ['lat' => 34.0837, 'lng' => 74.7973, 'id' => '1501785888041-af3ef285b470'],
            "Ooty" => ['lat' => 11.4102, 'lng' => 76.6950, 'id' => '1452421822248-d4c2b47f0c81'],
            "Darjeeling" => ['lat' => 27.0360, 'lng' => 88.2627, 'id' => '1436491865332-7a61ce2ed9ce'],
            "Munnar" => ['lat' => 10.0889, 'lng' => 77.0595, 'id' => '1506461883276-59b1e967a57a'],
            "Kerala Backwaters" => ['lat' => 9.5833, 'lng' => 76.5167, 'id' => '1476514525535-07fb3b4ae5f1'],
            "Pondicherry" => ['lat' => 11.9416, 'lng' => 79.8083, 'id' => '1512343879784-a960bf40e7f2'],
            "Rishikesh" => ['lat' => 30.0869, 'lng' => 78.2676, 'id' => '1587478640470-a20d4e73b22e'],
            "Jim Corbett National Park" => ['lat' => 29.5300, 'lng' => 78.7747, 'id' => '1452421822248-d4c2b47f0c81'],
            "Mysore Palace" => ['lat' => 12.3051, 'lng' => 76.6551, 'id' => '1564507592227-cb84b196e862'],
            "Hampi" => ['lat' => 15.3350, 'lng' => 76.4600, 'id' => '1598324789736-4861f89564a0'],
            "Ajanta Caves" => ['lat' => 20.5519, 'lng' => 75.7033, 'id' => '1598324789736-4861f89564a0'],
            "Ellora Caves" => ['lat' => 20.0264, 'lng' => 75.1771, 'id' => '1598324789736-4861f89564a0'],
            "Vaishno Devi Temple" => ['lat' => 33.0308, 'lng' => 74.9490, 'id' => '1564507592227-cb84b196e862'],
            "Ranthambore National Park" => ['lat' => 26.0173, 'lng' => 76.5026, 'id' => '1452421822248-d4c2b47f0c81'],
            "Andaman Islands" => ['lat' => 11.7401, 'lng' => 92.6586, 'id' => '1512343879784-a960bf40e7f2'],
            "Mumbai" => ['lat' => 19.0760, 'lng' => 72.8777, 'id' => '1564507592227-cb84b196e862'],
            "Spiti Valley" => ['lat' => 32.2461, 'lng' => 78.0349, 'id' => '1506461883276-59b1e967a57a']
        ];

        $packages = ['Adventure Package', 'Cultural Tour', 'Honeymoon Special', 'Weekend Getaway', 'Luxury Retreat', 'Spiritual Journey'];
        $categories = ['hotel', 'tour', 'package'];

        $listings = [];
        $i = 0;
        foreach ($places as $place => $data) {
            $pkg = $packages[$i % count($packages)];
            $cat = $categories[$i % count($categories)];
            
            $priceAmount = ($cat === 'hotel') ? rand(5000, 12000) : rand(18000, 26000);
            $descDuration = ($cat === 'hotel') ? 'per night per person' : '3 nights 4 days per person';

            $listings[] = [
                'title' => $place . ' - ' . $pkg,
                'description' => 'Experience the beauty of ' . $place . ' with our exclusive ' . $pkg . '. Includes luxury stay, guided tours, and unforgettable memories (' . $descDuration . '). Book now to secure your spot for a magnificent journey to one of India\'s best locations.',
                'category' => $cat,
                'location' => [
                    'address' => 'Central ' . $place,
                    'city' => $place,
                    'country' => 'India',
                    'coordinates' => ['lat' => $data['lat'], 'lng' => $data['lng']],
                ],
                'price' => ['amount' => $priceAmount, 'currency' => 'INR'],
                'images' => [
                    'https://loremflickr.com/800/600/' . str_replace(' ', ',', strtolower($place)) . ',india/all',
                    'https://picsum.photos/seed/' . str_replace(' ', '', $place) . '2/800/600',
                ],
                'amenities' => ['Guide', 'Meals', 'Hotel', 'Transport', 'Insurance', 'WiFi'],
                'availability' => ['start_date' => '2026-06-01', 'end_date' => '2026-12-31', 'slots' => rand(5, 30)],
                'rating_avg' => round(4.5 + lcg_value() * 0.5, 1),
                'review_count' => rand(50, 500),
                'host_id' => 'system',
            ];
            $i++;
        }

        foreach ($listings as $listing) {
            Listing::create($listing);
        }

        $this->command->info('✅ Created ' . count($listings) . ' Indian destination listings');
    }
}
