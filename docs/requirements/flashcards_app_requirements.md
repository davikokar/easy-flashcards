# Project Specification: React Native Flashcards App (Android)

## Project Overview
You are tasked with developing the first version (v1) of an Android flashcards application using React Native. The primary goal is to allow users to study custom decks imported from local CSV files, track their performance, and support basic rich-text formatting within the cards.

## Tech Stack & Architecture
*   **Framework:** React Native (Target: Android)
*   **Navigation:** `@react-navigation/native` and `@react-navigation/bottom-tabs`
*   **State Management:** Context API, Zustand, or Redux (Agent's discretion)
*   **Local Storage:** `@react-native-async-storage/async-storage` (to persist decks and statistics)
*   **File Parsing:** `papaparse` (or similar) for handling CSV files
*   **File Selection:** `react-native-document-picker` to select local files
*   **HTML Rendering:** `react-native-render-html` (or similar) to handle HTML tags within questions/answers.

## Core Features & Requirements

### 1. Navigation
*   Implement a **Bottom Navigation Bar** layout.
*   Required Tabs:
    *   **Decks / Study:** View available decks, import new ones, and initiate study sessions.
    *   **Statistics:** View recorded stats for decks and individual cards.

### 2. Deck Management (Importing)
*   Users must be able to import a deck from a local CSV file on their Android device.
*   **CSV Specifications:**
    *   Delimiters supported: Semicolon (`;`) or Tab (`\t`).
    *   Headers required: `Question`, `Answer` (case-insensitive mapping preferred).
    *   *Example CSV format:*
        ```csv
        Question;Answer
        This is the question; This is the <b>answer</b>
        ```
*   Save the imported deck into local persistent storage.

### 3. Study Session (Playing the Deck)
*   Display cards one at a time.
*   **Front of Card:** Shows the `Question`.
*   **Action:** User taps to "flip" the card.
*   **Back of Card:** Shows the `Answer`.
*   **Feedback Mechanism:** Provide two buttons: **"Ok"** (knew it) and **"Not Ok"** (didn't know it).
*   **HTML Formatting:** Both Question and Answer fields must accurately render basic HTML tags (e.g., `<b>` for bold, `<i>` for italics, `<br />` for line breaks).

### 4. Statistics Tracking
*   **Recording:** 
    *   Track the total number of reviews per deck.
    *   Track the "Ok" vs "Not Ok" count for each individual card and aggregate them for the whole deck.
    *   Save these statistics to local storage after every study session.
*   **Display (Stats Screen):**
    *   Show a summary of all imported decks.
    *   Display overall success rate (percentage of "Ok" responses).
    *   Allow the user to drill down to see statistics for individual cards to identify difficult items.

## Step-by-Step Implementation Guide for Agent
1.  **Initialize Project:** Setup React Native app and install necessary dependencies (Navigation, Document Picker, CSV Parser, HTML Renderer, Async Storage).
2.  **Setup Navigation:** Create the Bottom Tab Navigator with placeholders for the "Decks" and "Stats" screens.
3.  **Implement Storage & State:** Create the data layer to handle saving/loading decks and statistics from local storage.
4.  **Build Import Feature:** Implement the document picker, parse the CSV, and save the mapped flashcards to the state.
5.  **Build UI - Flashcard Player:** Develop the flashcard component with animated flipping (optional but recommended), HTML rendering integration, and the "Ok"/"Not Ok" feedback loops.
6.  **Build UI - Statistics:** Create the data visualization screen summarizing the saved feedback data.
7.  **Final Polish:** Ensure layout looks good on Android devices and handles edge cases (empty states, malformed CSV errors).