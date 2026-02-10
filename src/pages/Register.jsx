import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function Register() {
    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container d-flex justify-content-center">
                <SignUp
                    path="/register"
                    routing="path"
                    signInUrl="/login"
                />
            </div>
        </div>
    );
}
