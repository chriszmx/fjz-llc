import React from 'react';

const apartments = [
    {
        name: '1108 Kenmore Ave, Buffalo 14216',
        description: '1 Bedroom, 1 Bathroom, 900 sqft',
        includes: 'Includes: Water, Trash, Snow Removal, Parking',
        available: 'Available Now',
        price: '$900/month',
        image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1076.9769952932356!2d-78.85977596767476!3d42.95853549020618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36d40249f98cb%3A0x7c96c87e2777dc70!2s1108%20Kenmore%20Ave%20%235%2C%20Buffalo%2C%20NY%2014216!5e1!3m2!1sen!2sus!4v1698608360196!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
        component: ''
    },
    {
        name: '171 Mead St North Tonawanda 14120',
        description: '1 Bedroom, 1 Bathroom, 900 sqft',
        includes: 'Includes: Heat, Water, Electric, Trash, Snow Removal, Lawn Care, Parking, Coin Laundry',
        available: 'TBD Under Renovation - December 1st',
        price: '$1500/month',
        image: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4226.076704406418!2d-78.86262742299064!3d43.03918359192539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d36e3f6f14cdf9%3A0xfb561de98d8c1bad!2s171%20Mead%20St%2C%20North%20Tonawanda%2C%20NY%2014120!5e1!3m2!1sen!2sus!4v1698608178595!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
        component: ''
    }
];

function AvailableApartments() {
    return (
        <div className="bg-gray-900 p-6 align-center">
            <h1 className="text-4xl font-bold tracking-tight text-white dark:text-gray-200 sm:text-5xl mb-10 text-center">
                Available Apartments
            </h1>

            {apartments.length === 0 ? (
                <div className="text-xl text-white dark:text-gray-200">No apartments currently available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apartments.map((apt, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                            <iframe src={apt.image} alt={apt.name} className="w-full h-60 object-cover mb-4 rounded" />

                            <div className='flex-1 flex flex-col'>
                                <h2 className="text-2xl font-semibold mb-2">{apt.name}</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{apt.description}</p>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{apt.available}</p>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{apt.includes}</p>
                                <div className="text-lg font-bold mb-4">{apt.price}</div>
                            </div>

                            <div className="text-gray-400 mt-auto">
                                <a href={apt.component}>View More (coming soon)</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
    );
}


export default AvailableApartments;
