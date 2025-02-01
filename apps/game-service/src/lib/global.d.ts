import { Channel } from "amqplib";
import type Docker from 'dockerode'
declare global {
    namespace Express {
       interface Request {
            channel:Channel
            docker:Docker
        }
    }
}