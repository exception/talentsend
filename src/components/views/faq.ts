type FaqItem = {
    title: string;
    value: string;
};

export const faq: FaqItem[] = [
    {
        title: 'What are stock options?',
        value: "Stock options give you the right to buy a certain number of a companies shares at a fixed price (your strike price). They aren't actual shares of the company. They let you lock in a price for shares even when the price goes up in the future.",
    },
    {
        title: 'What are the different types of options?',
        value: 'There are two main types of options - ISOs (incentive stock options) and NSOs (non-qualified stock options). With NSOs you typically have to pay taxes when you exercise them and when you sell them. With ISOs you typically aren\'t taxed until you sell them.',
    },
    {
        title: "What's vesting?",
        value: "Vesting is the process in which you earn the right to your options through certain conditions, often related to long-term commitment. This is designed to incentivize employees to stick with a company before receiving their full equity-based compensation."
    },
    {
        title: "What does exercising stock options mean?",
        value: "Exercising your stock options means purchasing shares of company stock at your strike price. You can usually only exercise options that have vested, and you're not obligated to actually exercise. Many companies have an “exercise window” which is how long you have after leaving a company to buy some or all of your options."
    },
    {
        title: "How is my strike price determined?",
        value: "Your strike price is based on the fair market value of our shares, determined by a 409a valuation which is an appraisal conducted by an independent third party."
    }
];
