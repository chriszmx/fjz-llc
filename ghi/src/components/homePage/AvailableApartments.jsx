import React from "react";
import { useState } from "react";

const apartments = [
    // {
    //     name: "1108 Kenmore Ave #5, Buffalo 14216",
    //     description:`
    //     **Newly Renovated Urban Oasis in the Heart of North Buffalo**

    //     **Modern Updates Throughout**

    //     **Convenient Utilities Included**

    //     Discover the perfect blend of comfort and city living in this fully renovated 1 bedroom upper apartment. Located in the bustling heart of North Buffalo, this home offers a fresh start with its contemporary updates and convenient amenities.

    //     **Apartment Features:**
    //     - **Contemporary Living Space:** Experience urban living with new carpeting and a fully updated interior that reflects modern tastes.
    //     - **Updated Kitchen:** A brand new kitchen complete with a stove, refrigerator, and built-in microwave for your culinary adventures.
    //     - **Sleek Bathroom:** Enjoy the comforts of an updated bathroom with stylish fixtures.
    //     - **Essential Utilities Covered:** Water and trash services are included, simplifying your monthly bills.
    //     - **Parking Included:** Take advantage of the off-street parking, a true luxury in city living.

    //     **Additional Advantages:**
    //     - **Electric and Gas Responsibility:** You have control over your electric and gas usage, allowing you to manage your energy expenses efficiently.
    //     - **Smoke-Free Environment:** Live in a smoke-free apartment for a cleaner, healthier lifestyle.
    //     - **No Pet Policy:** A pet-free space ensures a clean and well-maintained environment for all residents.
    //     - **Prime Location:** Situated in the lively North Buffalo area, you'll be at the center of it all with dining, shopping, and entertainment options just steps away.

    //     This apartment is not just a place to live; it's a launching pad to the vibrant North Buffalo lifestyle. Perfect for individuals seeking an affordable, updated space in a dynamic neighborhood. Don't miss the chance to make this inviting apartment your new home!

    //     **Available Now:** Ready for immediate move-in, this apartment is waiting for you to bring it to life.
    //     `,
    //     includes: "1 Bedroom, 1 Bathroom, 900sqft",
    //     available: "Available Now",
    //     price: "$900/month",
    //     images: [
    //         "https://images.craigslist.org/00k0k_8R3P4Hpjq8I_0CI0t2_600x450.jpg",
    //         "https://images.craigslist.org/00l0l_6KX5BsMW8Nt_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00i0i_fdgr1gsBf8U_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/01414_6iTd99KQLFf_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00606_kvvUrAbxkma_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00101_2ROECO5Hvrj_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00R0R_fdgUAQPYO1x_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00y0y_ascSvQouPiO_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00909_awLNOh1Mu9F_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00Z0Z_lAWWJv1BecZ_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00404_8Xshf8kNLjm_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00C0C_koKEbbKcZ6n_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00D0D_2qEnSVZlaAY_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/01717_iztXY6fhg6b_0t20CI_1200x900.jpg",
    //         "https://images.craigslist.org/00j0j_4mTy8DnFwbq_0t20CI_1200x900.jpg",
    //     ],
    //     image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1076.9769952932356!2d-78.85977596767476!3d42.95853549020618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36d40249f98cb%3A0x7c96c87e2777dc70!2s1108%20Kenmore%20Ave%20%235%2C%20Buffalo%2C%20NY%2014216!5e1!3m2!1sen!2sus!4v1698608360196!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
    //     component: "",
    // },



    {
        name: "171 Mead St #3, North Tonawanda 14120",
        description: `
        **Charming 2nd-Floor Apartment with Private Balcony**

        Step into comfort with this newly renovated apartment that's designed for modern living. Nestled in a quaint 4-unit building, this gem offers a serene retreat with the convenience of city living.

        **Apartment Features:**
        - **Private Balcony:** Your own outdoor space to relax and enjoy the fresh air.
        - **Fully-Equipped Kitchen:** Brand new appliances including a stove, refrigerator, dishwasher, and built-in microwave.
        - **Contemporary Bathroom:** An updated bathroom with sleek fixtures.
        - **Utilities Included:** Heat, water, and trash services are all taken care of.
        - **Maintenance-Free Living:** Snow removal and lawn care are included, ensuring a pristine environment all year round.
        - **Convenient Laundry:** Coin-operated laundry facilities on-site for your ease.
        - **Parking:** Off-street parking available for your vehicle's security.

        **Additional Perks:**
        - **Energy-Efficient:** You only pay for electric and gas, with all other utilities included.
        - **No Smoking Policy:** Enjoy a smoke-free living space for a healthier lifestyle.
        - **Available January 1st:** Start the new year in your new home. Currently under renovation to ensure everything is perfect for your move-in.

        This apartment is perfect for those seeking a blend of comfort and convenience. Don't miss out on making this lovely space your next home!
            `,
        includes:
            "2 Bedroom, 1 Bathroom, 1,200sqft",
        available: "Available January 1st - Currently under renovation to ensure everything is perfect for your move-in.",
        price: "$1,200/month",
        images: [
            "https://images.craigslist.org/00202_bEVUdxAxmvP_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00Q0Q_3EpR6X4bpFQ_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00k0k_j1SAMZ9pMrI_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00505_9CNmpnkBmuV_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00C0C_dGl1h1Azaa3_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00A0A_cQeQKR3Al98_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00K0K_emEJ275PmZ5_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00404_gCzJsjHQiIA_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00707_id8O3eKbPhO_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/01515_kJrfxyuBRQk_0CI0t2_1200x900.jpg",
            "https://images.craigslist.org/00Z0Z_7ERy9LEdN6w_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00I0I_awzekRPPNl5_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00i0i_g7wBsa4kVZ4_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00101_1Xr3KCMTu8q_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00Y0Y_cB1D54XNYZF_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00K0K_367NaIqXTUm_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/01212_2uLjH3PKQrT_0t20CI_1200x900.jpg",
            "https://images.craigslist.org/00T0T_j7CrE7nBeHj_0t20CI_1200x900.jpg",
        ],
        image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d848.633870970211!2d-78.86046251377002!3d43.03909557186535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36e3f6f20066d%3A0x47a7a12a66133a55!2s171%20Mead%20St%20Apartment%203%2C%20North%20Tonawanda%2C%20NY%2014120!5e1!3m2!1sen!2sus!4v1700193853842!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
        component: "",
    },



    {
        name: "171 Mead St #6, North Tonawanda 14120",
        description: `
        **Brand New Garden-View Apartment with All-Inclusive Amenities**

        **Newly Remodeled**

        **Garden View**

        **All Utilities Included**

        Immerse yourself in the tranquility of this brand new, garden-view apartment. Situated in a cozy 4-unit building, this home has been completely remodeled to offer you a peaceful haven with the perks of urban living.

        **Apartment Features:**
        - **Garden View:** Revel in the beauty of nature with a serene garden outlook.
        - **All-Inclusive Utilities:** Enjoy the ease of having heat, electric, water, and trash services all included.
        - **State-of-the-Art Kitchen:** Equipped with new appliances such as a stove, refrigerator, built-in microwave, and dishwasher.
        - **Sleek Bathroom:** A brand new bathroom outfitted with modern fixtures.
        - **Maintenance-Free Lifestyle:** Benefit from included snow removal and lawn care for a pristine living environment throughout the seasons.
        - **On-Site Laundry:** Convenient coin-operated laundry facilities available within the building.
        - **Dedicated Parking:** Have peace of mind with off-street parking for your vehicle.

        **Additional Benefits:**
        - **Energy Efficiency:** With all utilities covered, manage your budget with ease.
        - **Smoke-Free Policy:** Breathe easy in a smoke-free environment that promotes a healthier way of life.
        - **No Pet Policy:** Enjoy a pet-free space that's clean and well-maintained.
        - **Available December 15th:** Be the first to experience the comfort and style of this newly renovated apartment. Ready for you to move in just in time for the holidays.

        This apartment is ideal for those who value new, clean spaces with the convenience of included amenities. Seize the opportunity to call this exceptional garden-view apartment your new home!
        `,
        includes:
            "",
        price: "$1,100/month",
        available: "Available December 15th",
        images: [
            "https://images.craigslist.org/00W0W_5q5ANxEPFi2_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00707_3OveI01zZWF_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00I0I_fM7HKoCU3CX_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00Y0Y_cpFCyUKVUHq_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00k0k_eGyiI6CugGc_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00M0M_7uFa3QLnID7_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00R0R_kptUaxoKUYv_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00Z0Z_hH2KJprcAy7_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00404_aKZ5MIIljDZ_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00K0K_g4tn38icjfG_0t20CI_600x450.jpg",
            "https://images.craigslist.org/01515_5QURtaAK9xF_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00808_kRAWKMQ2DDI_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00p0p_dIpJFgJxtTl_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00707_kFRCvFy7cw2_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00S0S_kPQD1IfmGnO_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00n0n_gwQdGjz6mK3_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00d0d_34LS4MNdK3M_0t20CI_600x450.jpg",
            "https://images.craigslist.org/00d0d_34LS4MNdK3M_0t20CI_600x450.jpg",
        ],
        image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4226.076704406418!2d-78.86262742299064!3d43.03918359192539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36e3f6f14cdf9%3A0xfb561de98d8c1bad!2s171%20Mead%20St%2C%20North%20Tonawanda%2C%20NY%2014120!5e1!3m2!1sen!2sus!4v1698608178595!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
        component: "",
    },
];

function ApartmentDescription({ description }) {
    const formattedDescription = description
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold with **
        .replace(/\n\n/g, '<br><br>') // New paragraphs
        .replace(/-\s(.*?):/g, '<li><strong>$1:</strong>') // List items
        .replace(/\n/g, ''); // Remove any remaining newlines

    return (
        <div
            className="apartment-description"
            dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
    );
}

function ImageCarousel({ images }) {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };



    return (
        <div className="relative">
            <img
                src={images[currentImage]}
                alt={`Slide ${currentImage}`}
                className="w-full h-80 object-cover rounded"
            />
            <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full focus:outline-none"
                onClick={prevImage}
            >
                &#10094;
            </button>
            <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full focus:outline-none"
                onClick={nextImage}
            >
                &#10095;
            </button>
        </div>
    );
}

function ApartmentCard({ apartment }) {
    return (
        <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">
                    {apartment.name}
                </h2>
                <br />
                {/* Image Carousel */}
                <ImageCarousel images={apartment.images} />
                <br />

                <p className="text-gray-300 dark:text-gray-300 mb-4">
                    {apartment.includes}
                </p>

                <p className="text-gray-300 dark:text-gray-300 mb-4">
                    {/* {apartment.description} */}
                    <ApartmentDescription description={apartment.description} />
                </p>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                    {apartment.available}
                </p>
                <div className="text-lg font-bold mb-4 text-gray-300">
                    {apartment.price}
                </div>
            </div>

            <br />

            {/* Google Maps iframe */}
            <iframe
                src={apartment.image}
                title={apartment.name}
                className="w-full h-80 object-cover mb-4 rounded"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="text-gray-400 mt-auto">
                {/* <a href={apartment.component}>View More (coming soon)</a> */}
                <a href="#scheduleViewing">Schedule a viewing today</a>
            </div>
        </div>
    );
}

function AvailableApartments() {
    return (
        <div className="bg-gray-900 p-6 align-center">
            <h1 className="text-4xl font-bold tracking-tight text-white dark:text-gray-200 sm:text-5xl mb-10 text-center">
                Available Apartments
            </h1>

            {apartments.length === 0 ? (
                <div className="text-xl text-white dark:text-gray-200">
                    No apartments currently available.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apartments.map((apt) => (
                        <ApartmentCard key={apt.name} apartment={apt} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AvailableApartments;

// import React from 'react';
// import { Carousel } from "@material-tailwind/react";

// const apartments = [
//     {
//         name: '1108 Kenmore Ave #5, Buffalo 14216',
//         description: '1 Bedroom, 1 Bathroom, 900 sqft',
//         includes: 'Includes: Water, Trash, Snow Removal, Parking',
//         available: 'Available Now',
//         price: '$900/month',
//         image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1076.9769952932356!2d-78.85977596767476!3d42.95853549020618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36d40249f98cb%3A0x7c96c87e2777dc70!2s1108%20Kenmore%20Ave%20%235%2C%20Buffalo%2C%20NY%2014216!5e1!3m2!1sen!2sus!4v1698608360196!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
//         component: ''
//     },
//     {
//         name: '171 Mead St #3, North Tonawanda 14120',
//         description: '2 Bedroom, 1 Bathroom, 1,100 sqft',
//         includes: 'Includes: Heat, Water, Trash, Snow Removal, Lawn Care, Parking, Coin Laundry',
//         available: 'TBD Under Renovation - January 1st',
//         price: '$1,200/month',
//         image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d848.633870970211!2d-78.86046251377002!3d43.03909557186535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36e3f6f20066d%3A0x47a7a12a66133a55!2s171%20Mead%20St%20Apartment%203%2C%20North%20Tonawanda%2C%20NY%2014120!5e1!3m2!1sen!2sus!4v1700193853842!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
//         component: ''
//     },
//     {
//         name: '171 Mead St #5, North Tonawanda 14120',
//         description: '1 Bedroom, 1 Bathroom, 1,000 sqft',
//         includes: 'Brand New. Garden View. Includes: Heat, Water, Electric, Trash, Snow Removal, Lawn Care, Parking, Coin Laundry, Stove, Refrigerator, Built-in Microwave, Dishwasher, ALL UTILITIES ARE INCLUDED.',
//         available: 'TBD Under Renovation - December 1st',
//         price: '$1,100/month',
//         image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4226.076704406418!2d-78.86262742299064!3d43.03918359192539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36e3f6f14cdf9%3A0xfb561de98d8c1bad!2s171%20Mead%20St%2C%20North%20Tonawanda%2C%20NY%2014120!5e1!3m2!1sen!2sus!4v1698608178595!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
//         component: ''
//     },
// ];

// function AvailableApartments() {
//     return (
//         <div className="bg-gray-900 p-6 align-center">
//             <h1 className="text-4xl font-bold tracking-tight text-white dark:text-gray-200 sm:text-5xl mb-10 text-center">
//                 Available Apartments
//             </h1>

//             {apartments.length === 0 ? (
//                 <div className="text-xl text-white dark:text-gray-200">No apartments currently available.</div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {apartments.map((apt, index) => (
//                         <div key={index} className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
//                             <iframe src={apt.image} alt={apt.name} className="w-full h-80 object-cover mb-4 rounded" />

//                             <div className='flex-1 flex flex-col'>
//                                 <h2 className="text-2xl font-semibold mb-2">{apt.name}</h2>
//                                 <p className="text-gray-300 dark:text-gray-300 mb-4">{apt.description}</p>
//                                 <p className="text-gray-300 dark:text-gray-300 mb-4">{apt.available}</p>
//                                 <p className="text-gray-300 dark:text-gray-300 mb-4">{apt.includes}</p>
//                                 <div className="text-lg font-bold mb-4 text-gray-300">{apt.price}</div>
//                             </div>

//                             <div className="text-gray-400 mt-auto">
//                                 <a href={apt.component}>View More (coming soon)</a>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <br /><br />
//         </div>
//     );
// }

// export default AvailableApartments;
