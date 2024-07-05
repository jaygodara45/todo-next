import { connectDB } from "@/lib/config/db";
import todoModel from "@/lib/models/TodoModel";
import { NextResponse } from "next/server";

const loadDB = async () => {
    await connectDB();
}

loadDB();

export async function GET(request){
    const todos = await todoModel.find({});

    return NextResponse.json({todos: todos})
}
export async function POST(request){
    const {title, description} = await request.json();

    await todoModel.create({
        title,
        description
    })

    return NextResponse.json({msg: "TODO CREATED"})
}

export async function DELETE(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await todoModel.findByIdAndDelete(mongoId);
    return NextResponse.json({msg: "TODO DELETED"})
}


export async function PUT(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await todoModel.findByIdAndUpdate(mongoId, {
        $set:{
            isCompleted: true
        }
    });
    return NextResponse.json({msg: "TODO COMPLETED"})
}