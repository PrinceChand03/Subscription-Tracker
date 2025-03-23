import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Subscription Price is required'],
    min: [0, 'Price must be greater than 0'],
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR'],
    default: 'EUR',
  },
  frequency: {
    type: String,
    enum: ['giornaliera', 'settimanale', 'mensile', 'annua'],
    // default: 'monthly',
  },
  category: {
    type: String,
    enum: ['sport', 'intrattenimento', 'tecnologia', 'finanza', 'altro', 'film', 'musica', 'notizie', 'lifestyle', 'bambini'],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'mastercard', 'bonifico', 'contanti', 'altro'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: [true, 'Start Date is required'],
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start Date must be in the past',
    },
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: 'Renewal Date must be greater than Start Date',
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, { timestamps: true });


// auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    let renewalDate = new Date(this.startDate);
    switch (this.frequency) {
      case 'daily':
        renewalDate.setDate(renewalDate.getDate() + 1);
        break;
      case 'weekly':
        renewalDate.setDate(renewalDate.getDate() + 7);
        break;
      case 'monthly':
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;
      case 'yearly':
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        break;
    }
    this.renewalDate = renewalDate;
  }

  // auto-update the status if renewal date passed
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;