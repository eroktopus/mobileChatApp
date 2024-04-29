Mobile Chat App
Project Description
The Mobile Chat App is a simple chat application built using React Native. It allows users to enter a username, choose a background color, and chat with other users in real-time. The app features a clean and intuitive user interface, making it easy for users to start chatting right away.

How to Get the Project Running
To get the Mobile Chat App running on your local machine, follow these steps:

Clone the Repository: First, clone this repository to your local machine.
Install Dependencies: Navigate to the project directory and install the necessary dependencies.
Run the App: Once the dependencies are installed, you can start the app.
Project Dependencies
The Mobile Chat App depends on the following technologies and tools:

React Native: The app is built using React Native, a framework for building native applications using React.
Expo: Expo is used for easy development and deployment of React Native applications. It provides a set of tools and services that simplify the development process.
npm: npm is the package manager for JavaScript and is used to install and manage project dependencies.
React Navigation: React Navigation is used for navigation within the app, allowing users to navigate between different screens.
react-native-gifted-chat: This library provides a fully featured chat UI for React Native applications.

Firebase Integration
In the Mobile Chat App, Firebase is utilized for various functionalities including real-time data storage, authentication, and cloud storage. Here's how Firebase is integrated into the app:

Authentication
Firebase Authentication is used to handle user authentication in the Mobile Chat App. Users can sign in anonymously, allowing them to join chat rooms and participate in conversations without the need for a dedicated account.

Real-time Database (Firestore)
Messages sent by users are stored in Firestore collections in real-time, enabling instant message delivery and synchronization across all connected devices. Firestore's powerful querying capabilities are leveraged to retrieve messages ordered by creation timestamp, ensuring a chronological display of chat history.

Cloud Storage
When users upload images or record audio messages, the files are securely stored in Firebase Cloud Storage, and their download URLs are stored in Firestore along with the corresponding chat messages. This approach ensures efficient storage and retrieval of multimedia content while maintaining scalability and reliability.

Integration Details
The Firebase SDK for JavaScript is integrated into the app using npm packages, allowing seamless interaction with Firebase services from within the React Native environment. Firebase configuration details, including API keys and project identifiers, are securely stored and accessed within the app, ensuring proper authentication and data access controls.
