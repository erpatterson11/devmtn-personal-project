const config = {
  dev: {
    database: {
        connectionString: 'postgres://cuwojvetedbaho:8f8052bb58837e048486f61914359305c011767f5d0000d14e9b13220d5e60c1@ec2-174-129-223-193.compute-1.amazonaws.com:5432/dc3msnlob6gpou?ssl=true'
    },
    //server details
    server: {
        host: '127.0.0.1',
        port: '3001'
    },
    session: {
        secret: '32nt3847tvn638muref34cnmyt347gmfh28turc1n28uc'
    },
    auth0Strategy: {
        domain: 'erpatterson11.auth0.com',
        clientID: 'vGG1LZkPrY2F7RrOGVLvvRidkccv1zkW',
        clientSecret: '15bqf0vA-Pf197BEMF5z0VQB9SUl7HJ94PhWLQn69M57TtmSH4zsAbh4Fbpy_y-1',
        callbackURL: '/auth/callback'
    }
  }
};

module.exports = config
