// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Config, Manager};
use std::fs::File;
use env_logger::Builder;
use log::LevelFilter;
use url::Url;

fn main() {
    let log_file = File::create("tauri_app.log").expect("Failed to create log file");
    Builder::new()
        .filter(None, LevelFilter::Debug)
        .target(env_logger::Target::Pipe(Box::new(log_file)))
        .init();

    tauri::Builder::default()
        .setup(|app| {
            let config: &Config = app.config();
            let dev_url = config.build.dev_url.as_ref().expect("devUrl not found").to_string();
            log::info!("Using dev_url: {}", dev_url);

            let window = app.get_webview_window("main")
                .expect("Failed to get window 'main'");

            if !cfg!(debug_assertions) {
                let parsed_url = match dev_url.parse::<Url>() {
                    Ok(url) => url,
                    Err(e) => {
                        log::error!("Failed to parse dev_url: {}", e);
                        return Err(Box::new(tauri::Error::InvalidUrl(e)) as Box<dyn std::error::Error>);
                    }
                };
                window.navigate(parsed_url).expect("Failed to navigate to dev_url");
            }

            log::info!("Window accessed successfully");
            window.maximize().unwrap();
            log::info!("Window maximized");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}