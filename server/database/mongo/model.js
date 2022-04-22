const productSchema = new mongoose.Schema({
  product_id: Number,
  results: [
    {
      review_id: Number,
      rating: Number,
      summary: String,
      recommend: Boolean,
      response: String,
      body: String,
      date: String,
      reviewer_name: String,
      helpfulness: Number,
      photos: [
        {
          photo_id: Number,
          url: String,
        }
      ],
      characteristics: {
        characteristic_id: Number,
        name: String,
        value: Number,
      }
    }
  ],

})