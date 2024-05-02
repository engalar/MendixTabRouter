import type { Meta, StoryObj } from "@storybook/react";
import { createElement, ReactElement, useEffect } from "react";

import { Alert, AlertProps } from "./Alert";



function Template(args: AlertProps): ReactElement | null {
    useEffect(() => {
        // add external stylesheet
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/gh/engalar/MendixTheme@14210f8dd6e14bc596c5a24dbe3ea1006817f5fe/theme.compiled.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
            // remove external stylesheet
            document.head.removeChild(link);
        };
    });
    return <Alert {...args}></Alert>;
}

// 👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Alert> = {
    component: Template,
    argTypes: {
        bootstrapStyle: {
            control: { type: "select" },
            options: ["default", "primary", "success", "info", "inverse", "warning", "danger"],
        },
        message: { control: { type: "text" } },
        className: { control: { type: "text" } },
    },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const FirstStory: Story = {
    args: {
        bootstrapStyle: "default",
        message: "This is a default alert",
        className: "my-custom-class",
    }
};
