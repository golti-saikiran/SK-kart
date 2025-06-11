const registerMockdata = {
  "name": "saikiran",
  "password": "123",
  "email": "saikir@gmail.com",
  "mobile": 9876543210,
  "avatar": "",
  "refresh_token": "",
  "verify_email": false,
  "last_login_date": "",
  "status": "Active",
  "address_details": [],
  "shopping_cart": [],
  "orderHistory": "",
  "forgot_password_otp": "",
  "forgot_password_expiry": "",
  "allowed_to_update_password": false,
  "role": "user"
}

const loginMockdata = {
  "email": "sai",
  "password": "123"
}

const dummyuserId = "67c9a36f2eb00eeb0f600241"


const product1 = {
  "productname": "chicken dum biryani",
  "product_image_url": "",
  "quantity_available": 100,
  "price": 140,
  "discount": 20,
  "description": "chicken dum biryani",
  "category": "6818cc10db11e41fb218229a",
  "sub_category": "6818cf2b8c7d4581a4f56c94",
  "rating": 4.3
}

const product2 = {
  "productId": "P002",
  "productname": "chicken Noodels",
  "quantity_available": 20,
  "price": 120,
  "offer_price": 90,
  "offers_available": true,
  "available_promocodes": ["FIRST50", "NEWUSER100"],
  "category": "food",
  "sub_category": "Chineese",
  "rating": 4.6
}

const product3 = {
  "productId": "P003",
  "productname": "Roadster adem black t-shirt",
  "quantity_available": 76,
  "price": 1300,
  "offer_price": 699,
  "offers_available": true,
  "available_promocodes": ["ROADSTER50", "NEWUSER100"],
  "category": "clothing",
  "sub_category": "t-shirts",
  "rating": 3.8
}

const order1 = {
  "orderId": "Or0001",
  "userId": "U0001",
  "payment_mode": "COD",
  "amount_paid": 200,
  "items_ordered": [{
    "productId": "P0001",
    "productname": "chicken dum biryani",
    "quantity": 2
  }],
  "order_details": [{
    "status": "ordered",
    "ordered_date": "24-02-2025",
    "dispatched_date": "24-02-2025",
    "deliver_date": "24-02-2025"
  }]
}

const order2 = {
  "orderId": "Or0002",
  "userId": "U0002",
  "payment_mode": "UPI",
  "amount_paid": 699,
  "items_ordered": [{
    "productId": "P0003",
    "productname": "Roadster adem black t-shirt",
    "quantity": 1
  }],
  "order_details": [{
    "status": "delivered",
    "ordered_date": "24-02-2025",
    "dispatched_date": "24-02-2025",
    "deliver_date": "24-02-2025"
  }]
}

const order3 = {
  "orderId": "Or0003",
  "userId": "U0001",
  "payment_mode": "UPI",
  "amount_paid": 90,
  "items_ordered": [{
    "productId": "P0002",
    "productname": "chicken Noodels",
    "quantity": 1
  }],
  "order_details": [{
    "status": "delivered",
    "ordered_date": "24-02-2025",
    "dispatched_date": "24-02-2025",
    "deliver_date": "24-02-2025"
  }]
}

const categorymockdata = {
  "category_name": "Food",
  "category_image_url": ""
}

const subcategorymockdata = {
  "subcategory_name": "Biryani",
  "subcategory_image_url": "",
  "category": "food"
}

const addressmockdata = {
  "userId": "67c9a36f2eb00eeb0f600241",
  "address_line": "jhgksfdsfjhsgfjgsf",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "mobile": 9876543210,
  "pincode": 500062
}

const cartmockdata = {
  "userid": "6819bb5068b2a3c228d7dfa6",
  "productid": "6818d5ee579394fb856c8dd3"
}

const ordermockdata = {
  "userId": "6819bb5068b2a3c228d7dfa6",
  "total_amount": 200,
  "items_ordered": [{
    "product": "6818d5ee579394fb856c8dd3"
  }],
  "payment_mode": "Cash on Delivery",
  "address": "6818f3db00b78160ad299dc9",
  "status": "Ordered",
  "ordered_date": "2023-10-01",
  "deliver_date": "2023-10-05"
}