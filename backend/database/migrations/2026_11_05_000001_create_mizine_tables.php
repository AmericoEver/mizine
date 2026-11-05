<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default("Mizine\nProdução");
            $table->text('tagline')->nullable();
            $table->string('banner_date')->nullable();
            $table->string('banner_title')->nullable();
            $table->text('banner_description')->nullable();
            $table->string('intent_title')->nullable();
            $table->text('intent_subtitle')->nullable();
            $table->string('showreel_video_url')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('whatsapp_url')->nullable();
            $table->string('instagram_handle')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('contact_email')->nullable();
            $table->timestamps();
        });

        Schema::create('about_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tag_title')->default('Abordagem');
            $table->string('tag_subtitle')->nullable();
            $table->text('main_heading')->nullable();
            $table->text('subtext')->nullable();
            $table->timestamps();
        });

        Schema::create('reels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('video_url')->nullable();
            $table->string('image_url')->nullable();
            $table->string('art_class')->default('a1');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_wide')->default(false);
            $table->string('art_class')->default('a3');
            $table->string('image_url')->nullable();
            $table->string('link_url')->default('#contacto');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author');
            $table->string('company')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('timeline_items', function (Blueprint $table) {
            $table->id();
            $table->string('year_label');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('initial', 5)->default('M');
            $table->string('avatar_url')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('group_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('button_text')->default('Visitar');
            $table->string('link_url')->default('#');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('project_type')->default('Reels e vídeos curtos');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('group_companies');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('timeline_items');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('reels');
        Schema::dropIfExists('about_settings');
        Schema::dropIfExists('hero_settings');
    }
};

