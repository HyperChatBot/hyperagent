# Hyper Agent

Advanced AI agent using your own knowledge bases and APIs.

![Hyper Agent](./screenshots/chatbot.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-green)](https://prettier.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/HyperChatBot/hyperchat/pulls)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D20.18.0-green.svg)](https://nodejs.org/en/)
[![Twitter](https://img.shields.io/badge/Twitter-Connect-brightgreen?logo=twitter)](https://twitter/YanceyOfficial)

## Calling Tools

- GetDate
- GetExchangeRate
- GetInformationFromKnowledgeBase
- GetWeather

## AI Agents

- RAG Chatbot
- AI Mail

## To start developing Hyper Agent

### Setting up pgvector and Importing Sample Data

> This guide outlines the steps to set up a pgvector Docker container and import sample data into your PostgreSQL database.

1. **Start the pgvector container**: Navigate to the root directory of your project and run:

    ```bash
    docker compose up -d
    ```

    This command boots a Docker container running [pgvector](https://github.com/pgvector/pgvector).

2. **Access the container's terminal**:  Execute the following command, replacing `<CONTAINER_ID_OF_PGVECTOR_DB>` with the actual ID of your pgvector container:

    ```bash
    docker exec -it <CONTAINER_ID_OF_PGVECTOR_DB> bash
    ```

    You can find the container ID using `docker ps`.

3. **Connect to the blog database**: Inside the container's terminal, connect to your database using psql:

    ```bash
    psql -U tennoheika -h localhost blog
    ```

4. **Enable the vector extension**:  Run the following SQL command to enable vector support in your database:

    ```sql
    CREATE EXTENSION vector;
    ```

5. **Create database tables**: In your project's root directory, apply database migrations using Drizzle Kit:

    ```bash
    npx drizzle-kit push
    ```

    This command creates the posts and embeddings tables within the blog database.

6. **Import sample data**: Return to the container's terminal and execute the following commands to import data from the provided CSV files:

    ```sql
    COPY posts FROM '/sample-data/posts.csv' WITH (FORMAT CSV, HEADER, DELIMITER ',', QUOTE '"', ESCAPE '\');

    COPY embeddings FROM '/sample-data/embeddings.csv' WITH (FORMAT CSV, HEADER, DELIMITER ',', QUOTE '"', ESCAPE '\');
    ```

### Environment Variables

```bash
DATABASE_URL=postgresql://tennoheika:jinping8964@localhost:5432/blog

EMAIL_ADDRESS=<YOUR_GMAIL_ADDRESS>
EMAIL_PASSWORD=<YOUR_GMAIL_PASSWORD>

EXCHANGE_RATE_API_KEY=<YOUR_EXCHANGE_RATE_API_KEY> # https://openexchangerates.org/account/app-ids

OPENAI_API_KEY=<YOUR_OPENAI_API_BASE_URL>
OPENAI_API_BASE_URL=<YOUR_OPENAI_API_BASE_URL>

FIGMA_ACCESS_TOKEN=<YOUR_FIGMA_ACCESS_TOKEN>
```

## Contributing

The main purpose of this repository is to continue to evolve Hyper Agent, making it faster and easier to use. Development of Hyper Agent happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Hyper Agent.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

Hyper Agent has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](./CONTRIBUTING.md)

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Hyper Agent.

### Good Issues

Please make sure to read the [Issue Reporting Checklist](./.github/ISSUE_TEMPLATE/bug_report.md) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Discussions

If you have any questions or feedback about Hyper Agent, please visit our [official discussion forum](https://github.com/orgs/HyperChatBot/discussions/71) to start a conversation with our team or other users. We are committed to making Hyper Agent the best possible chat application, and your feedback plays a crucial role in achieving this goal.

## License

Hyper Agent is licensed under the terms of the [MIT licensed](https://opensource.org/licenses/MIT).
