import type { Meta, StoryObj } from "@storybook/react";
import { createElement, useEffect } from "react";

import BadgeSample from "./BadgeSample";


// 👇 This default export determines where your story goes in the story list
const meta: Meta<typeof BadgeSample> = {
    component: BadgeSample,
    argTypes: {
        prefixValue: { control: { type: "text" } },
        className: { control: { type: "text" } },
    },
};

export default meta;
type Story = StoryObj<typeof BadgeSample>;

export const FirstStory: Story = {
    render: args => {
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
        return <BadgeSample {...args}></BadgeSample>
    },
    args: {
        prefixValue: "xxx",
        className: "my-custom-class",
    }
};
