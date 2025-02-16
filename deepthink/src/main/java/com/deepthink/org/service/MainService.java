package com.deepthink.org.service;

import reactor.core.publisher.Flux;

public interface MainService {
	public String getStanderdResponse(String propmt);
	public Flux<String> getResponseByStream(String propmt);
}
