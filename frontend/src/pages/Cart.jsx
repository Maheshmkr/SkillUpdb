import { MainLayout } from "@/components/MainLayout";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <ShoppingCart size={48} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">Your Cart is Empty</h1>
                        <p className="text-muted-foreground text-lg max-w-md">
                            Looks like you haven't added any courses to your cart yet. Start exploring our world-class library!
                        </p>
                    </div>
                    <Link
                        to="/explore"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <ArrowLeft size={18} />
                        Browse Courses
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default Cart;
