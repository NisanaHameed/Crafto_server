import Stripe from "stripe";
const stripe = new Stripe(process.env.stripe_key as string);

class StripePayment {

    async makePayment(email: string, plan: string,userId:string) {
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
                success_url: "http://localhost:5173/professional/successPayment",
                cancel_url: 'http://localhost:5173/professional/cancelPayment',
                metadata: { userId: userId },
                billing_address_collection: 'required'
            })

            return session.id;
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            throw error;
        }

    }

    async cancelSubscription(sessionId: string) {
        try {
            console.log(sessionId)
            const deletedSubscription = await stripe.subscriptions.cancel(sessionId);
            return deletedSubscription;
        } catch (err) {
            console.log('Subscription cancellation failed');
            throw err;
        }
    }
}

export default StripePayment;