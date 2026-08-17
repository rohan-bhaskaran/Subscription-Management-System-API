import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR','INR'],// restricted values
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['Sports', 'News', 'Entertainment', 'LifeStyle', 'Technology', 'Finance', 'Politics', 'Other'],
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(val) {
                return val >= new Date();
            },
            message: "The Start date cannot be in past"
        }
    },
    renewalDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal','Bank Transfer', 'Cash', 'Other'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, {timestamps: true});

subscriptionSchema.pre('save', function () {
    if (this.startDate && this.frequency) {
        const renewal = new Date(this.startDate);
    
        switch (this.frequency){
            case "daily":
                renewal.setDate(renewal.getDate() + 1);
                break;
            case "weekly":
                renewal.setDate(renewal.getDate() + 7);
                break;
            case "monthly":
                renewal.setMonth(renewal.getMonth() + 1);
                break;
            case "yearly":
                renewal.setFullYear(renewal.getFullYear() + 1);
                break;
        }

        this.renewalDate = renewal;
        if (this.renewalDate < new Date()) {
            this.status = "expired";
        }
    }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
