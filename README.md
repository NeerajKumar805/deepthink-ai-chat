# DeepThink - AI Chat Application

DeepThink is a real-time chat application inspired by ChatGPT, built using **Spring Boot**, **Ollama**, and the **Qwen Model (qwen2.5:14b)**. It provides a seamless conversational experience across web and mobile platforms.

## Features
- **Clear History:** Instantly clear chat history with a single click.
- **Download Chat:** Save entire conversations for future reference.
- **Copy Content:** Easily copy text or code snippets.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- **Java 17+**
- **Maven**
- **Spring Boot**
- **Git**
- **Ollama (for Qwen Model)**

### Steps to Set Up

#### 1. Clone the Repository
```sh
git clone https://github.com/neerajkumarroy805@gmail.com/deepthink.git
cd deepthink
```

#### 2. Install and Configure Ollama
1. Download and install **Ollama** from the [official website](https://ollama.com/).
2. Pull the **Qwen Model**:
   ```sh
   ollama pull qwen2.5:14b
   ```

#### 3. Build and Run the Backend
```sh
mvn clean install
mvn spring-boot:run
```
The backend will start on **http://localhost:8080**.

#### 4. Integrate the Frontend
Place your frontend files inside `src/main/resources/static`.

#### 5. Test the API
Use **Postman** or **Swagger UI** to test API responses.

## Deployment
To deploy the application, package it as a JAR and host it on a cloud service like **AWS, DigitalOcean, or Render**.

## Contributing
Feel free to submit **issues, feature requests, or pull requests** to improve DeepThink.

## License
This project is **open-source** under the MIT License.

#### Snapshots
![deepseek-ss](https://github.com/user-attachments/assets/6954f646-6fef-4e00-8476-6611f96714fc)
![deepseek-ss4](https://github.com/user-attachments/assets/e9c555de-a1ec-4bef-aec5-e56f9dc23d61)
![deepseek-ss3](https://github.com/user-attachments/assets/9d984692-341c-40d9-a0b1-bfb4413cecf2)
![deepseek-ss2](https://github.com/user-attachments/assets/a93b3716-e592-45e3-8035-72ba41321f7e)


---
### Made with ❤️ using Spring Boot & AI (Ollama)

