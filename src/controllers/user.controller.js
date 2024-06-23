export const user = (req, res) => {
    try {
        const userName = req.query.visitorName;
        if (!userName) {
            return res.status(400).json({ message: 'Visitor name is required' });
        }

        // Retrieve client's IP address from req.headers or req.socket
        let clientsIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        // Handle IPv6-mapped IPv4 addresses
        if (clientsIp.includes('::ffff:')) {
            clientsIp = clientsIp.split(':').pop();
        }

        return res.status(200).json({ clientsIp: clientsIp, visitorName: userName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
