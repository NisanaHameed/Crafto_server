"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_KEY);
class StripePayment {
    makePayment(email, plan, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('profemail', email);
            let subscriptionPlanId;
            if (plan === 'monthly') {
                subscriptionPlanId = 'price_1P7yVpSCG87ABkwC64tgfuOh';
            }
            else if (plan === 'yearly') {
                subscriptionPlanId = 'price_1P7zsESCG87ABkwCAjgopRuS';
            }
            console.log('subscriptionPlanId', subscriptionPlanId);
            try {
                const session = yield stripe.checkout.sessions.create({
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
                });
                return session.id;
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelSubscription(subscriptionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(subscriptionID);
                const deletedSubscription = yield stripe.subscriptions.cancel(subscriptionID);
                return deletedSubscription;
            }
            catch (err) {
                throw err;
            }
        });
    }
    fetchSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield stripe.subscriptions.list({
                    limit: 100,
                });
                return subscriptions;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = StripePayment;
