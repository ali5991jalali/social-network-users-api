// Packages
const mongoose = require('mongoose');

module.exports = {
    errors: {
        0: "Undefined error from server",
        1: 'Please send all required data',
        2: 'Type of data that you sent is not in correct type',
        3: 'Something went wrong in server, we will check it as soon as possible',
        4: "Not found",
        5: "Unauthorized",
        6: "Content-Type must be application/json",
        7: "API-KEY is not in correct format",
        8: "Duplicate key error for unique variable",
        9: "Not found route",
        10: "Requested key is illegal",
        11: "You can not access this route"
    },
    mimetypes: {
        'application/json': { type: 'json', address: 'cdn/json', extension: 'json', size: '10' },
        'text/csv': { type: 'csv', address: 'cdn/csv', extension: 'csv', size: '5' },
    },
    dataKeys: {
        name: 'name',
        email: 'email',
        type: 'type',
        status: 'status',
        hidden: 'hidden',
        containerId: 'containerId',
        channelId: 'channelId',
        conversationId: 'conversationId',
        tags: 'tags',
        notes: 'notes',
        options: 'options',
        online: 'meta.online',
        phone: 'meta.phone',
        avatar: 'meta.avatar',
        title: 'meta.title',
        location: 'meta.location',
        browser: 'meta.browser',
        lastPage: 'meta.lastPage',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    responseKeys: {
        create: ['_id', 'name', 'email', 'type', 'status', 'hidden', 'containerId', 'channelId', 'conversationId', 'tags', 'notes', 'options', 'online', 'phone', 'avatar', 'title', 'location', 'browser', 'lastPage', 'live', 'createdAt', 'updatedAt'],
        findOne: ['_id', 'name', 'email', 'type', 'status', 'hidden', 'containerId', 'channelId', 'conversationId', 'tags', 'notes', 'options', 'online', 'phone', 'avatar', 'title', 'location', 'browser', 'lastPage', 'live', 'createdAt', 'updatedAt'],
        update: ['_id', 'name', 'email', 'type', 'status', 'hidden', 'containerId', 'channelId', 'conversationId', 'tags', 'notes', 'options', 'online', 'phone', 'avatar', 'title', 'location', 'browser', 'lastPage', 'live', 'createdAt', 'updatedAt'],
        find: ['_id', 'name', 'email', 'type', 'status', 'hidden', 'containerId', 'channelId', 'conversationId', 'tags', 'notes', 'options', 'online', 'phone', 'avatar', 'title', 'location', 'browser', 'lastPage', 'live', 'createdAt', 'updatedAt']
    },
    patterns: {
        isString: /^[A-Za-z0-9\_\,\s]+$/,
        isInt: /^\d+$/,
        isPhone: /^0?9\d{9}$/,
        isCreateType: /^(1|2|3|4|5){1}$/,
        isCreateHidden: /^(1|2){1}$/,
        isQueryDate: /^\d{4}-\d{2}-\d{2}$/,
        isStatus: /^(1|2|3){1}$/
    },
    paramValidation: {
        import: {
            body: {
                exist: ['type', 'channelId'],
                typeCheck: {
                    type: 'isService',
                    channelId: 'isMongoId'
                }
            }
        },
        create: {
            body: {
                exist: ['channelId'],
                typeCheck: {
                    email: 'isEmail',
                    type: 'isCreateType',
                    hidden: 'isCreateHidden',
                    containerId: 'isMongoId',
                    channelId: 'isMongoId',
                    conversationId: 'isMongoId',
                    tags: ' ',
                    notes: 'isArray',
                    phone: 'isPhone',
                    online: 'isBoolean',
                    status: 'isStatus'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            }
        },
        findOne: {
            params: {
                exist: [],
                typeCheck: {
                    id: 'isMongoId'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            }
        },
        find: {
            query: {
                exist: ['channelId'],
                typeCheck: {
                    limit: 'isInt',
                    skip: 'isInt',
                    createdAtFrom: 'isQueryDate',
                    createdAtTo: 'isQueryDate',
                    updatedAtFrom: 'isQueryDate',
                    updatedAtTo: 'isQueryDate',
                    fields: 'isString',
                    email: 'isEmail',
                    type: 'isCreateType',
                    hidden: 'isCreateHidden',
                    channelId: 'isMongoId',
                    conversationId: 'isMongoId',
                    phone: 'isPhone',
                    online: 'isBoolean',
                    status: 'isStatus',
                    tags: 'isMongoId',
                    notes: 'isMongoId'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            }
        },
        update: {
            params: {
                exist: [],
                typeCheck: {
                    id: 'isMongoId'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            },
            body: {
                exist: [],
                typeCheck: {
                    email: 'isEmail',
                    type: 'isCreateType',
                    hidden: 'isCreateHidden',
                    channelId: 'isMongoId',
                    conversationId: 'isArray',
                    tags: 'isArray',
                    notes: 'isArray',
                    phone: 'isPhone',
                    status: 'isStatus'
                }
            }
        },
        remove: {
            params: {
                exist: [],
                typeCheck: {
                    id: 'isMongoId'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            }
        },
        login: {
            body: {
                exist: ['code'],
                typeCheck: {}
            }
        },
        logout: {
            body: {
                exist: ['code'],
                typeCheck: {}
            }
        },
        count: {
            body: {
                exist: [],
                typeCheck: {

                }
            },
            query: {
                exist: [],
                typeCheck: {
                    createdAtFrom: 'isQueryDate',
                    createdAtTo: 'isQueryDate',
                    updatedAtFrom: 'isQueryDate',
                    updatedAtTo: 'isQueryDate',
                    email: 'isEmail',
                    type: 'isCreateType',
                    hidden: 'isCreateHidden',
                    channelId: 'isMongoId',
                    conversationId: 'isMongoId',
                    phone: 'isPhone',
                    online: 'isBoolean',
                    status: 'isStatus'
                }
            },
            user: {
                exist: ['containerId'],
                typeCheck: {}
            }
        }
    },
    dataConverts: {
        create: {
            boolean: [
                'online'
            ],
            trimAndLowerCase: [
                'name',
                'email',
                'channelId',
                'avatar',
                'conversationId'
            ],
            number: [
                'type',
                'status'
            ]
        },
        find: {
            boolean: [
                'online'
            ],
            trimAndLowerCase: [
                'name',
                'email',
                'channelId',
                'avatar',
                'conversationId'
            ],
            number: [
                'type',
                'status'
            ]
        },
        update: {
            boolean: [
                'online'
            ],
            trimAndLowerCase: [
                'name',
                'email',
                'channelId',
                'avatar',
                'conversationId'
            ],
            number: [
                'type',
                'status'
            ]
        },
        count: {
            boolean: [
                'online'
            ],
            trimAndLowerCase: [
                'name',
                'email',
                'channelId',
                'avatar',
                'conversationId'
            ],
            number: [
                'type',
                'status'
            ]
        }
    },
    syncData: {
        crisp: {
            json: {
                index: 'data',
                name: `meta.nickname`,
                email: `meta.email`,
            },
            csv: {
                name: 'nickname',
                email: 'email',
            }
        },
        chaport: {
            json: {
                index: 'result',
                name: 'name',
                email: 'email',
            },
            csv: {
                name: 'name',
                email: 'email',
            }
        },
        snapengage: {
            json: {
                index: 'result',
                name: 'visitor email',
                email: 'Labels and Visitor',
            },
            csv: {
                name: 'visitor email',
                email: 'Labels and Visitor',
            }
        },
        drift: {
            json: {
                index: 'result',
                name: 'First Name',
                email: 'email',
            },
            csv: {
                name: 'name',
                email: 'email',
            }
        },
        zendesk: {
            json: {
                index: 'user',
                name: 'name',
                email: 'email'
            },
            csv: {
                name: 'visitor_name',
                email: 'visitor_email',
            }
        },
        livechatinc: {
            json: {
                index: 'chats',
                name: 'visitor.name',
                email: 'visitor.email'
            },
            csv: {
                name: 'visitor_name',
                email: 'visitor_email'
            }
        },
        //  not complete
        liveperson: {
            json: {
                index: '',
                name: '',
                email: '',
            },
            csv: {
                name: 'visitor Name',
                email: 'visitor ID'
            }
        },
        intercom: {
            csv: {
                name: 'ID',
                email: 'ID'
            }
        }
    },
    validServices: ['crisp', 'chaport', 'snapengage', 'intercom', 'liveperson', 'drift', 'livechatinc', 'zendesk'],
    rangeKeys: {
        'createdAtFrom': {
            typeCheck: 'isQueryDate',
            address: 'createdAt'
        },
        'createdAtTo': {
            typeCheck: 'isQueryDate',
            address: 'createdAt'
        },
        'updatedAtFrom': {
            typeCheck: 'isQueryDate',
            address: 'updatedAt'
        },
        'updatedAtTo': {
            typeCheck: 'isQueryDate',
            address: 'updatedAt'
        }
    },
    illegalResponseKeys: {
        create: ['meta'],
        findOne: ['meta'],
        find: ['meta'],
        update: ['meta']
    },
    illegalQueryKeys: [
        'createdAt',
        'updatedAt',
        'containerId',
        'meta',
        'options',
        'socket'
    ],
    'legalServices': [
        'chat',
        'container',
        'SocialMediaIntegrate',
        'register',
        'client',
        'widgetClient',
        'socket'
    ],
    'legalIps': [
        '127.0.0.1',
        '188.40.212.34'
    ],
    notes: {
        dataKeys: {
            userId: 'userId',
            agentId: 'agentId',
            text: 'text',
            url: 'url',
            containerId: 'containerId',
            channelId: 'channelId',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        responseKeys: {
            create: ['_id', 'userId', 'agentId', 'text', 'url', 'containerId', 'channelId', 'createdAt', 'updatedAt'],
            findOne: ['_id', 'userId', 'agentId', 'text', 'url', 'containerId', 'channelId', 'createdAt', 'updatedAt'],
            update: ['_id', 'userId', 'agentId', 'text', 'url', 'containerId', 'channelId', 'createdAt', 'updatedAt'],
            find: ['_id', 'userId', 'agentId', 'text', 'url', 'containerId', 'channelId', 'createdAt', 'updatedAt']
        },
        paramValidation: {
            create: {
                body: {
                    exist: ['agentId', 'userId', 'text', 'channelId'],
                    typeCheck: {
                        agentId: 'isMongoId',
                        userId: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            findOne: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            find: {
                query: {
                    exist: ['channelId'],
                    typeCheck: {
                        limit: 'isInt',
                        skip: 'isInt',
                        createdAtFrom: 'isQueryDate',
                        createdAtTo: 'isQueryDate',
                        updatedAtFrom: 'isQueryDate',
                        updatedAtTo: 'isQueryDate'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            update: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                },
                body: {
                    exist: [],
                    typeCheck: {
                        url: 'isURL'
                    }
                }
            },
            remove: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            }
        },
        illegalResponseKeys: {
            create: [],
            findOne: [],
            find: [],
            update: []
        },
        illegalQueryKeys: [
            'createdAt',
            'updatedAt'
        ]
    },
    tags: {
        dataKeys: {
            agentId: 'agentId',
            title: 'title',
            tc: 'tc',
            channelId: 'channelId',
            containerId: 'containerId',
            conversationCount: 'conversationCount',
            contactCount: 'contactCount',
            isArchived: 'isArchived',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        responseKeys: {
            create: ['_id', 'agentId', 'title', 'tc', 'channelId', 'containerId', 'conversationCount', 'contactCount','isArchived', 'createdAt', 'updatedAt'],
            update: ['_id', 'agentId', 'title', 'tc', 'channelId', 'containerId', 'conversationCount', 'contactCount','isArchived', 'createdAt', 'updatedAt'],
            find: ['_id', 'agentId', 'title', 'tc', 'channelId', 'containerId', 'conversationCount', 'contactCount','isArchived', 'createdAt', 'updatedAt']
        },
        paramValidation: {
            create: {
                body: {
                    exist: ['agentId', 'title', 'channelId'],
                    typeCheck: {
                        agentId: 'isMongoId',
                        userId: 'isMongoId',
                        isArchived:'isBoolean'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            findOne: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            find: {
                query: {
                    exist: ['channelId'],
                    typeCheck: {
                        limit: 'isInt',
                        skip: 'isInt',
                        createdAtFrom: 'isQueryDate',
                        createdAtTo: 'isQueryDate',
                        updatedAtFrom: 'isQueryDate',
                        updatedAtTo: 'isQueryDate',
                        channelId: 'isMongoId',
                        isArchived:'isBoolean'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            update: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                },
                body: {
                    exist: [],
                    typeCheck: {
                        isArchived:'isBoolean'
                    }
                }
            },
            remove: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            }
        },
        illegalResponseKeys: {
            create: [],
            findOne: [],
            find: [],
            update: []
        },
        illegalQueryKeys: [
            'createdAt',
            'updatedAt'
        ],
        tcColors: [
            '#303F9F',
            '#00814F',
            '#AD1457',
            '#841474',
            '#4A148C',
            '#5D4037',
            '#1A0016',
            '#0277BD',
            '#006064',
            '#D32F2F',
            '#A3188E',
            '#5E35B1',
            '#795548',
            '#455A64',
            '#0096A2',
            '#C2185B',
            '#616161'
        ]
    },
    statistic: {
        dataKeys: {
            userId: 'userId',
            interaction: 'interaction',
            lead: 'lead',
            user: 'user',
            containerId: 'containerId',
            channelId: 'channelId',
            changes: 'changes',
            type: 'type',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        responseKeys: {
            findOne: ['_id', 'userId', 'interaction', 'lead', 'user', 'containerId', 'channelId', 'changes', 'type', 'createdAt', 'updatedAt'],
            find: ['_id', 'userId', 'interaction', 'lead', 'user', 'containerId', 'channelId', 'changes', 'type', 'createdAt', 'updatedAt']
        },
        paramValidation: {
            findOne: {
                params: {
                    exist: [],
                    typeCheck: {
                        id: 'isMongoId'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            },
            find: {
                query: {
                    exist: ['channelId'],
                    typeCheck: {
                        limit: 'isInt',
                        skip: 'isInt',
                        createdAtFrom: 'isQueryDate',
                        createdAtTo: 'isQueryDate',
                        updatedAtFrom: 'isQueryDate',
                        updatedAtTo: 'isQueryDate'
                    }
                },
                user: {
                    exist: ['containerId'],
                    typeCheck: {}
                }
            }
        },
        illegalResponseKeys: {
            create: [],
            findOne: [],
            find: [],
            update: []
        },
        illegalQueryKeys: [
            'createdAt',
            'updatedAt'
        ]
    }

}