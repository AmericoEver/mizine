<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MizineContentSeeder extends Seeder
{
    public function run(): void
    {
        // Hero
        DB::table('hero_settings')->truncate();
        DB::table('hero_settings')->insert([
            'title' => "Mizine\nProdução",
            'tagline' => 'Vídeos curtos, reels e histórias com olhar de cinema. Filmamos, montamos e entregamos conteúdo que fica na memória.',
            'banner_date' => '[00/00]',
            'banner_title' => '[Evento recente]',
            'banner_description' => '[Descrição curta do último trabalho.]',
            'intent_title' => "Cada plano\ntem uma intenção",
            'intent_subtitle' => 'Do guião à última frame, cuidamos de tudo.',
            'showreel_video_url' => '',
            'whatsapp_number' => '+258 00 000 0000',
            'whatsapp_url' => 'https://wa.me/258000000000',
            'instagram_handle' => '@mizine',
            'instagram_url' => 'https://instagram.com/mizine',
            'contact_email' => 'ola@mizine.com',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // About
        DB::table('about_settings')->truncate();
        DB::table('about_settings')->insert([
            'tag_title' => 'Abordagem',
            'tag_subtitle' => 'Quem somos e como trabalhamos.',
            'main_heading' => 'Trabalhamos com clientes corajosos para criar experiências que as pessoas sentem. Trabalho ousado pede uma abordagem sem medo.',
            'subtext' => '[Escreva aqui 2 linhas sobre a Mizine: quando nasceu, o que acredita, o que entrega.]',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Reels
        DB::table('reels')->truncate();
        $reels = [
            ['title' => 'Reel 1', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a1', 'order' => 1],
            ['title' => 'Reel 2', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a2', 'order' => 2],
            ['title' => 'Reel 3', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a3', 'order' => 3],
            ['title' => 'Reel 4', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a4', 'order' => 4],
            ['title' => 'Reel 5', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a5', 'order' => 5],
            ['title' => 'Reel 6', 'subtitle' => '[Cliente / ano]', 'art_class' => 'a6', 'order' => 6],
        ];
        foreach ($reels as $r) {
            DB::table('reels')->insert(array_merge($r, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Projects
        DB::table('projects')->truncate();
        $projects = [
            [
                'title' => '[Projeto principal]',
                'description' => '[Uma linha sobre o que foi feito e para quem.]',
                'is_wide' => true,
                'art_class' => 'a3',
                'link_url' => '#contacto',
                'order' => 1
            ],
            [
                'title' => '[Projeto 2]',
                'description' => '[Descrição curta.]',
                'is_wide' => false,
                'art_class' => 'a1',
                'link_url' => '#contacto',
                'order' => 2
            ],
            [
                'title' => '[Projeto 3]',
                'description' => '[Descrição curta.]',
                'is_wide' => false,
                'art_class' => 'a5',
                'link_url' => '#contacto',
                'order' => 3
            ],
        ];
        foreach ($projects as $p) {
            DB::table('projects')->insert(array_merge($p, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Clients
        DB::table('clients')->truncate();
        $clients = ['[Cliente 1]', '[Cliente 2]', '[Cliente 3]', '[Cliente 4]', '[Cliente 5]', '[Cliente 6]'];
        foreach ($clients as $idx => $c) {
            DB::table('clients')->insert([
                'name' => $c,
                'order' => $idx + 1,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Testimonials
        DB::table('testimonials')->truncate();
        $testimonials = [
            ['quote' => '“[Testemunho do cliente sobre o trabalho da Mizine.]”', 'author' => '[Nome]', 'company' => '[Empresa]', 'order' => 1],
            ['quote' => '“[Testemunho do cliente sobre o trabalho da Mizine.]”', 'author' => '[Nome]', 'company' => '[Empresa]', 'order' => 2],
            ['quote' => '“[Testemunho do cliente sobre o trabalho da Mizine.]”', 'author' => '[Nome]', 'company' => '[Empresa]', 'order' => 3],
        ];
        foreach ($testimonials as $t) {
            DB::table('testimonials')->insert(array_merge($t, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Timeline
        DB::table('timeline_items')->truncate();
        $timeline = [
            ['year_label' => '[Ano]', 'title' => '[Início da Mizine]', 'description' => '[Como tudo começou.]', 'order' => 1],
            ['year_label' => '[Ano]', 'title' => '[Primeiro grande trabalho]', 'description' => '[O que mudou a partir daí.]', 'order' => 2],
            ['year_label' => '[Ano]', 'title' => '[Crescimento da equipa]', 'description' => '[Novos serviços, novos clientes.]', 'order' => 3],
            ['year_label' => '[Hoje]', 'title' => '[Grupo Mizine]', 'description' => '[Onde estamos agora e para onde vamos.]', 'order' => 4],
        ];
        foreach ($timeline as $tl) {
            DB::table('timeline_items')->insert(array_merge($tl, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Team
        DB::table('team_members')->truncate();
        $team = [
            ['name' => '[Nome]', 'role' => '[Função]', 'initial' => 'M', 'order' => 1],
            ['name' => '[Nome]', 'role' => '[Função]', 'initial' => 'I', 'order' => 2],
            ['name' => '[Nome]', 'role' => '[Função]', 'initial' => 'Z', 'order' => 3],
            ['name' => '[Nome]', 'role' => '[Função]', 'initial' => 'E', 'order' => 4],
        ];
        foreach ($team as $tm) {
            DB::table('team_members')->insert(array_merge($tm, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Group companies
        DB::table('group_companies')->truncate();
        $group = [
            ['name' => 'Mizine Celebrate', 'description' => 'Convites digitais para eventos.', 'button_text' => 'Visitar', 'link_url' => 'https://instagram.com/mizine_celebrate', 'order' => 1],
            ['name' => '[Empresa 2]', 'description' => '[Descrição de uma linha.]', 'button_text' => 'Visitar', 'link_url' => '#', 'order' => 2],
            ['name' => '[Empresa 3]', 'description' => '[Descrição de uma linha.]', 'button_text' => 'Visitar', 'link_url' => '#', 'order' => 3],
        ];
        foreach ($group as $g) {
            DB::table('group_companies')->insert(array_merge($g, ['created_at' => now(), 'updated_at' => now()]));
        }
    }
}

