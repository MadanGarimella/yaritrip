package com.yaritrip.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@EnableAsync
@Configuration
public class AsyncConfig {

    @Bean(name = "authTaskExecutor")
    public Executor authTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(20);      // always-ready threads
        executor.setMaxPoolSize(100);      // burst capacity
        executor.setQueueCapacity(500);    // queue when all threads busy
        executor.setKeepAliveSeconds(60);
        executor.setThreadNamePrefix("auth-worker-");

        // Don't drop requests under load — caller runs it instead
        executor.setRejectedExecutionHandler(
            new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()
        );

        executor.initialize();
        return executor;
    }
}