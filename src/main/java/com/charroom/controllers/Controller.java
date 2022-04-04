package com.charroom.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.charroom.models.Message;

@RestController
public class Controller {
	
	@SendTo("/topic/return-to")
	@MessageMapping("/chat.sendMessage")
	/*public Message getMessage(@RequestBody Message msg) {
		
		
		return msg;
	}*/
	public Message sendMessage(@Payload Message webSocketChatMessage) {
		return webSocketChatMessage;
	}

	@MessageMapping("/chat.newUser")
	@SendTo("/topic/return-to")
	public Message newUser(@Payload Message webSocketChatMessage,
			SimpMessageHeaderAccessor headerAccessor) {
		headerAccessor.getSessionAttributes().put("name", webSocketChatMessage.getName());
		return webSocketChatMessage;
	}
	
	
}
