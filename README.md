
Description:
Developed an innovative platform inspired by Instagram where networking devices share their status, including metrics such as CPU usage, health, and uptime. This project was developed as part of a Hackathon and includes features for dynamic packet routing and comprehensive admin tools.

Key Features:

Device Metrics Sharing: Devices share real-time status updates with metrics like CPU usage, health, and uptime. When a metric exceeds a predefined threshold, the device automatically posts a "story" containing the relevant data and a generated image.
Random Packet Generation: Simulated network traffic by generating packets with random source and destination devices, increasing CPU load and testing system performance under various conditions.
Dynamic Packet Routing: Implemented Dijkstra's algorithm to find the shortest path for packet transmission. Automatically rerouted packets through alternative paths when nodes experienced high CPU load, ensuring optimal network performance.
Friendship and Packet Sharing: Enabled devices to send friend requests, accept connections, and share packets with mutual friends, mimicking social media interactions.
Admin Dashboard: Provided an admin interface to monitor device statuses, generate charts for any node, and troubleshoot issues. Admins could also temporarily deactivate nodes for maintenance.
Tech Stack:

Frontend: React.js
Backend: Express.js
Database: MongoDB
Skills Demonstrated:

Front-End Development: Designed and implemented a user-friendly interface using React.js, enabling real-time updates and interactive data visualization.
Back-End Development: Developed robust API endpoints with Express.js to handle data collection, packet routing, and admin functionalities.
Database Management: Utilized MongoDB for efficient storage and retrieval of device metrics, stories, and packet information.
Algorithm Implementation: Applied Dijkstra's algorithm for dynamic and efficient packet routing.
Performance Optimization: Ensured system reliability and performance under varying loads by implementing load-balancing techniques.
Collaboration and Project Management: Successfully collaborated with team members, dividing tasks and integrating different components into a cohesive platform.
Impact:

Demonstrated the feasibility of a social network-inspired platform for networking devices, enhancing monitoring and management capabilities.
Provided a scalable solution for dynamic packet routing and network performance optimization.
Enhanced troubleshooting and administrative capabilities, leading to more efficient network management.
