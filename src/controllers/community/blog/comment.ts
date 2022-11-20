import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import { v4 } from 'uuid';

import { Request, Response } from 'express';

dotenv.config();

const prisma = new P.PrismaClient();