import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container d-flex justify-content-center">
                <SignIn
                    path="/login"
                    routing="path"
                    signUpUrl="/register"
                />
            </div>
        </div>
    );
}
