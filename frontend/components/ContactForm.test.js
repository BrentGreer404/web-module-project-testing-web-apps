import React from 'react';
import { queryByText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>)
});

test('renders the contact form header', () => {
    render(<ContactForm/>)
    const header = screen.getByText(/contact form/i)
    expect(header).toBeInTheDocument()
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)
    const fNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(fNameInput, "two")
    const err = await screen.findAllByTestId('error')
    expect(err).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)
    const submit = screen.getByRole('button')
    userEvent.click(submit)
    const errors = await screen.findAllByTestId('error')
    expect(errors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)
    const fNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(fNameInput, "Dwight")

    const lNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(lNameInput, "Shrute")

    const submit = screen.getByRole('button')
    userEvent.click(submit)
    const errors = await screen.findAllByTestId('error')
    expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)
    const email = screen.getByLabelText(/email/i)
    userEvent.type(email, "beets")
    const error = await screen.findByText(/email must be a valid email address/i)
    expect(error).toBeInTheDocument()
    
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)
    const submit = screen.getByRole('button')
    userEvent.click(submit)
    const error = await screen.findByText(/lastName is a required field/i)
    expect(error).toBeInTheDocument()
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
    const fNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(fNameInput, "Dwight")

    const lNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(lNameInput, "Shrute")

    const emailInput = screen.getByLabelText(/email/i)
    userEvent.type(emailInput, "beets@beets.com")

    const submit = screen.getByRole('button')
    userEvent.click(submit)

    await waitFor(() => {
        const fname = screen.getByTestId(/firstnameDisplay/)
        const lname = screen.getByTestId(/lastnameDisplay/)
        const email = screen.getByTestId(/emailDisplay/)
        const message = screen.queryByTestId(/messageDisplay/)

        expect(fname).toBeInTheDocument()
        expect(lname).toBeInTheDocument()
        expect(email).toBeInTheDocument()
        expect(message).not.toBeInTheDocument()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const input1 = "Dwight"
    const fNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(fNameInput, input1)

    const input2 = "Shrute"
    const lNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(lNameInput, input2)

    const input3 = "beets@beets.com"
    const emailInput = screen.getByLabelText(/email/i)
    userEvent.type(emailInput, input3)

    const input4 = "bears, beets, battlestar gallactica"
    const messageInput = screen.getByLabelText(/message/i)
    userEvent.type(messageInput, input4)

    const submit = screen.getByRole('button')
    userEvent.click(submit)

    await waitFor(() => {
        const fname = screen.queryByTestId(/firstnameDisplay/)
        const lname = screen.queryByTestId(/lastnameDisplay/)
        const email = screen.queryByTestId(/emailDisplay/)
        const message = screen.queryByTestId(/messageDisplay/)

        expect(fname).toHaveTextContent(input1)
        expect(lname).toHaveTextContent(input2)
        expect(email).toHaveTextContent(input3)
        expect(message).toHaveTextContent(input4)
    })
});
