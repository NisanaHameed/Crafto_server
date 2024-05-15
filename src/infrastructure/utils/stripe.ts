import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY as string);

class StripePayment {

    async makePayment(email: string, plan: string, userId: string) {
        console.log('profemail', email)
        let subscriptionPlanId;
        if (plan === 'monthly') {
            subscriptionPlanId = 'price_1P7yVpSCG87ABkwC64tgfuOh'
        } else if (plan === 'yearly') {
            subscriptionPlanId = 'price_1P7zsESCG87ABkwCAjgopRuS'
        }
        console.log('subscriptionPlanId', subscriptionPlanId)

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [{
                    price: subscriptionPlanId,
                    quantity: 1
                }],
                mode: 'subscription',
                customer_email: email,
                success_url: "https://crafto-one.vercel.app/professional/successPayment/:asdfvbn",
                cancel_url: 'https://crafto-one.vercel.app/professional/cancelPayment/:asdfvbn',
                metadata: { userId: userId },
                billing_address_collection: 'required'
            })

            return session.id;
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            throw error;
        }

    }

    async cancelSubscription(subscriptionID: string) {
        try {
            console.log(subscriptionID)
            const deletedSubscription = await stripe.subscriptions.cancel(subscriptionID);
            return deletedSubscription;
        } catch (err) {
            console.log('Subscription cancellation failed');
            throw err;
        }
    }

    async fetchSubscriptions() {
        try {
            const subscriptions = await stripe.subscriptions.list({
                limit: 100,
            })
            return subscriptions;
        } catch (err) {
            console.log('failed to fetch subscriptions');
        }
    }
}

export default StripePayment;