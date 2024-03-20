export default function Example() {
    return (
        <div className="bg-gray-900 text-white">
            <div className="relative isolate pt-14">
                <div
                    className="absolute inset-x-0 -top-40 -z-40 transform-gpu overflow-hidden blur-3xl sm:-top-0"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-x-0 -top-40 -z-40 transform-gpu overflow-hidden blur-3xl sm:-top-0"
                        aria-hidden="true"
                    >
                        {/* Background decorative element */}
                    </div>
                </div>
                <div className="py-24 sm:py-32 lg:pb-40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                                Apartment Application Requirements
                            </h1>
                            <p className="mt-6 text-xl text-gray-300 sm:mx-auto">
                                Welcome to our community! We're delighted that
                                you're considering making your home with us. To
                                ensure a smooth and transparent application
                                process, we kindly ask all prospective tenants
                                to meet the following qualifications:
                            </p>
                            <div className="mt-10">
                                <ul className="list-disc space-y-4 text-left text-lg leading-8 text-gray-300 sm:mx-auto sm:text-center sm:list-inside">
                                    <li>
                                        <strong>Credit Score:</strong>{" "}
                                        Applicants must have a credit score of
                                        600 or above.
                                    </li>
                                    <li>
                                        <strong>Rental History:</strong> No
                                        evictions in the past 7 years.
                                    </li>
                                    <li>
                                        <strong>Criminal Background:</strong>{" "}
                                        Must have no felony convictions.
                                    </li>
                                    <ul>
                                        <li>
                                            <strong>
                                                Income Verification:
                                            </strong>
                                            <ul className="list-disc ml-4">
                                                <li>
                                                    For single occupants in a
                                                    one-bedroom unit, verified
                                                    income must be at least
                                                    twice (2x) the monthly rent.
                                                </li>
                                                <li>
                                                    For households or shared
                                                    accommodations in two (or
                                                    more)-bedroom units, the
                                                    combined income should be at
                                                    least three times (3x) the
                                                    monthly rent.
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>

                                    <li>
                                        <strong>Application Process:</strong>{" "}
                                        All applicants over 18 must fill out an
                                        application.
                                    </li>
                                    <li>
                                        <strong>No Pets: </strong>A pet-free
                                        space ensures a clean and
                                        well-maintained environment for all
                                        residents.
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-8 text-lg text-gray-400">
                                We are committed to providing equal housing
                                opportunities and ensuring our application
                                process is fair and transparent.
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
