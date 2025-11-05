// src/seed.js
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

export async function initialData() {
  try {

    const sysAdminExists = await User.findOne({ where: { username: "SysAdmin" } });
    const sellerExists = await User.findOne({ where: { username: "Seller" } });

    if (sysAdminExists && sellerExists) {
        console.log("initial insert omitted.");
        return;
    }

    console.log("initial insert");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password1", salt);

    let sysAdmin
    sysAdminExists
        ? sysAdmin = sysAdminExists
        : sysAdmin = await User.create({
            username: "SysAdmin",
            email: "sysadmin@gmail.com",
            password: hashedPassword,
            dni: "12345678",
            status: "SysAdmin",
            });

    let seller 
    sellerExists
        ? seller = sellerExists
        : seller = await User.create({
            username: "Seller",
            email: "seller@gmail.com",
            password: hashedPassword,
            dni: "23456789",
            status: "Seller",
            });


    const products = [
        {
            name: "White shirt",
            desc: "Cotton white shirt, simple",
            price: 50,
            stock: 100,
            type: "Top",
            imageURL: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hpcnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
            userId: sysAdmin.id,
        },
        {
            name: "Japanese shirt",
            desc: "Its got a cat on it! Represent NEET culture!",
            price: 90,
            stock: 5,
            type: "Top",
            imageURL: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: sysAdmin.id,
        },
        {
            name: "Pair of Nike shoes",
            desc: "Or is it Puma? Whatever",
            price: 500,
            stock: 20,
            type: "Footwear",
            imageURL: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNob2VzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
        },
        {
            name: "Denim shorts",
            desc: "For the summertime",
            price: 30,
            stock: 3,
            type: "Bottom",
            imageURL: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnRzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
        },
        {
            name: "Patek Philippe wristwatch",
            desc: "High end, swiss precision. You won´t regret this buy",
            price: 30000,
            stock: 2,
            type: "Accesory",
            imageURL: "https://images.unsplash.com/photo-1663564307062-8b6fda73705d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhdGVrJTIwcGhpbGlwcGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
        },
        {
            name: "Work boots",
            desc: "Steel toe, durable, good grip, will last you a lifetime",
            price: 800,
            stock: 2,
            type: "Footwear",
            imageURL: "https://images.unsplash.com/photo-1554133818-7bb790d55236?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJvb3RzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
        },
        {
            name: "Fake glasses",
            desc: "Plastic frame, no magnification. For when you need to look smart",
            price: 20,
            stock: 67,
            type: "Accessory",
            imageURL: "https://images.unsplash.com/photo-1556306510-31ca015374b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            userId: sysAdmin.id,
        },
        {
            name: "Rayband sunglasses",
            desc: "Brand shades with UV protection",
            price: 150,
            stock: 1,
            type: "Accessory",
            imageURL: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEdsYXNzZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
            userId: sysAdmin.id,
        },
        {
            name: "Used boots",
            desc: "delet dis",
            price: 99999,
            stock: 1,
            type: "Footwear",
            imageURL: "https://images.unsplash.com/photo-1511283402428-355853756676?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb3RzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
            deleted: true
        },
        {
            name: "Great jeans",
            desc: "Amazing jeans, buy one before theyre all gone!",
            price: 20,
            stock: 0,
            type: "Bottom",
            imageURL: "https://images.unsplash.com/photo-1714143136367-7bb68f3f0669?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fEplYW5zfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            userId: seller.id,
        },
    ];
    await Product.bulkCreate(products);
    
    console.log("Done with the initial inserting");
  } catch (error) {
    console.error("Error during initial insert", error);
  }
}
