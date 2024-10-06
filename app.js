//const prompt = require('prompt-sync')();

//const username = prompt('What is your name? ');

//console.log(`Your name is ${username}`);



require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./models/customer');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Failed to connect to MongoDB:',err));


console.log('Welcome to the CRM');

const menu = `
What would you like to do?
  1. Create a customer
  2. View all customers
  3. Update a customer
  4. Delete a customer
  5. Quit
`;

const chooseAction = () => {
    const action = prompt(menu + '\nNumber of action to run: ');

    switch (action) {
        case '1':
            createCustomer();
            break;
        case '2':
            viewCustomers();
            break;
        case '3':
            updateCustomer();
            break;
        case '4':
            deleteCustomer();
            break;
        case '5':
            console.log('Exiting...');
            mongoose.connection.close();
            process.exit();
        default:
            console.log('Invalid option. Please choose again.');
            chooseAction();
    }
};


const createCustomer = async () => {
    const name = prompt('Enter customer name: ');
    const age = parseInt(prompt('Enter customer age: '), 10);

    const newCustomer = new Customer({ name, age });
    await newCustomer.save();
    console.log('Customer created successfully.');
    chooseAction();
};



const viewCustomers = async () => {
    const customers = await Customer.find();
    if (customers.length === 0) {
        console.log('No customers found.');
    } else {
        customers.forEach(c => {
            console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`);
        });
    }
    chooseAction();
};



const updateCustomer = async () => {
    const customers = await Customer.find();
    customers.forEach(c => {
        console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`);
    });
    const id = prompt('Copy and paste the id of the customer to update: ');

    const customer = await Customer.findById(id);
    if (!customer) {
        console.log('Customer not found.');
        return chooseAction();
    }

    const newName = prompt('Enter new name: ') || customer.name;
    const newAge = parseInt(prompt('Enter new age: '), 10) || customer.age;

    customer.name = newName;
    customer.age = newAge;
    await customer.save();
    console.log('Customer updated successfully.');
    chooseAction();
};



const deleteCustomer = async () => {
    const customers = await Customer.find();
    customers.forEach(c => {
        console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`);
    });
    const id = prompt('Copy and paste the id of the customer to delete: ');

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
        console.log('Customer not found.');
        return chooseAction();
    }

    console.log('Customer deleted successfully.');
    chooseAction();
};



chooseAction();
