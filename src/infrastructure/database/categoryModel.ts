import Category from "../../domain/category";
import mongoose, { Schema } from "mongoose";

const CategorySchema:Schema<Category> = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const CategoryModel = mongoose.model<Category>('Category',CategorySchema);
export default CategoryModel;