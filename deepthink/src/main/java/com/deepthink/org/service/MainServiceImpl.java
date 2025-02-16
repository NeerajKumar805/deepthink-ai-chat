package com.deepthink.org.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;

@Service
public class MainServiceImpl implements MainService {

	private ChatClient chatClient;

	public MainServiceImpl(ChatClient.Builder builder) {
		this.chatClient = builder.build();
	}

	@Override
	public String getStanderdResponse(String prompt) {
		return chatClient.prompt(prompt).call().content();
	}
	
	@Override
	public Flux<String> getResponseByStream(String prompt) {
		return chatClient.prompt().user(prompt).stream().content();
	}

}
