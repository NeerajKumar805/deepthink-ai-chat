package com.deepthink.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.deepthink.org.service.MainService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api")
public class MainController {

	@Autowired
	private MainService service;
	 
	@CrossOrigin
	@PostMapping("/v1/chat")
	public ResponseEntity<Flux<String>> getResponseV1(@RequestParam(value="query", required=false, defaultValue = "Hey!") String query){
		Flux<String> res = service.getResponseByStream(query);
		return ResponseEntity.ok(res);
	}
	
	@CrossOrigin
	@PostMapping("/v2/chat")
	public ResponseEntity<Flux<String>> getResponseV2(@RequestParam(value="query", required=false, defaultValue = "Hey!") String query){
		Flux<String> res = service.getResponseByStream(query);
		return ResponseEntity.ok(res);
	}
}
