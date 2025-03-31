import React, { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Product } from "../assets/assets";

interface ErrorWithMessage {
    message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function toErrorWithMessage(error: unknown): ErrorWithMessage {
    if (isErrorWithMessage(error)) return error;
    try {
        return new Error(JSON.stringify(error));
    } catch {
        return new Error(String(error));
    }
}

function getErrorMessage(error: unknown): string {
    return toErrorWithMessage(error).message;
}

type CartItems = {
    [itemId: string]: {
        [size: string]: number;
    };
};


export type ShopContextType = { // Added export keyword
    products: Product[];
    currency: string;
    delivery_fee: number;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    cartItems: CartItems;
    addToCart: (itemId: string, size: string) => Promise<void>;
    setCartItems: React.Dispatch<React.SetStateAction<CartItems>>;
    getCartCount: () => number;
    updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
    getCartAmount: () => number;
    navigate: ReturnType<typeof useNavigate>;
    backendUrl: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    token: string;
};

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

type ShopContextProviderProps = {
    children: ReactNode;
};

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
    const currency = "Rs ";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState<CartItems>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [token, setToken] = useState<string>("");
    const navigate = useNavigate();

    const addToCart = async (itemId: string, size: string) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        const cartData = { ...cartItems };

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { itemId, size },
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(getErrorMessage(error));
            }
        }
    };

    const getCartCount = (): number => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size];
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId: string, size: string, quantity: number) => {
        const cartData = { ...cartItems };
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { itemId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(getErrorMessage(error));
            }
        }
    };

    const getCartAmount = (): number => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product.id === itemId);
            if (itemInfo) {
                for (const size in cartItems[itemId]) {
                    totalAmount += itemInfo.price * cartItems[itemId][size];
                }
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error));
        }
    };

    const getUserCart = async (token: string) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error));
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if (!token && localToken) {
            setToken(localToken);
            getUserCart(localToken);
        }
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value: ShopContextType = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
