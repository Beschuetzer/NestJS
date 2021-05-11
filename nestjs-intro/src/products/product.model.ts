import * as mongoose from 'mongoose';


export const ProductSchema = new mongoose.Schema({
  //have to use JS types not TS types
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

//Telling TS that Product is inheriting from mongoose's Document Interface
export interface Product extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  price: number;
}