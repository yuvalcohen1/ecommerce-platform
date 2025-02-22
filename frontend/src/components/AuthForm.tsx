import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { api } from "../api";

interface AuthFormProps {
  formType: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload =
      formType === "signup"
        ? { name, email, password, role: "customer" }
        : { email, password };

    try {
      const { data } = await api.post(`/users/${formType}`, payload);
      console.log(data.message);
    } catch (error) {
      console.error(`${formType.toUpperCase()} failed:`, error);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>{formType === "login" ? "Login" : "Sign Up"}</Title>
        <form onSubmit={handleSubmit}>
          {formType === "signup" && (
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">
            {formType === "login" ? "Login" : "Sign Up"}
          </Button>
        </form>

        <LinkContainer>
          {formType === "login" ? (
            <span>
              Don't have an account?{" "}
              <StyledLink to="/signup">Sign Up</StyledLink>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <StyledLink to="/login">Login</StyledLink>
            </span>
          )}
        </LinkContainer>
      </FormWrapper>
    </PageWrapper>
  );
};

export default AuthForm;

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(
      135deg,
      rgba(106, 116, 148, 0.5),
      rgba(75, 92, 113, 0.7)
    )

  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormWrapper = styled.div`
  max-width: 500px;
  padding: 50px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #6e7a9b, #4c5c71);
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  background: #f4f6f9;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    background: #fff;
  }

  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #003f7f;
  }
`;

const LinkContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
`;

const StyledLink = styled(Link)`
  color: #00bfff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
