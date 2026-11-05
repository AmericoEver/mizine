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
            'tagline' => 'Soluções Audiovisuais, Marketing e Publicidade. +3 anos criando conteúdos e histórias que posicionam marcas com olhar de cinema.',
            'banner_date' => 'DESTAQUE',
            'banner_title' => 'Audiovisual & Marketing',
            'banner_description' => 'Vídeos curtos, reels dinâmicos e campanhas de impacto para marcas corajosas.',
            'intent_title' => "Cada plano\ntem uma intenção",
            'intent_subtitle' => 'Do conceito criativo e captação à pós-produção e entrega final.',
            'showreel_video_url' => 'https://www.instagram.com/mizine_8/reels/',
            'whatsapp_number' => '+258 84 000 0000',
            'whatsapp_url' => 'https://wa.me/258840000000',
            'instagram_handle' => '@mizine_8',
            'instagram_url' => 'https://www.instagram.com/mizine_8',
            'contact_email' => 'support@mizine.co.mz',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // About
        DB::table('about_settings')->truncate();
        DB::table('about_settings')->insert([
            'tag_title' => 'Abordagem',
            'tag_subtitle' => 'Quem somos e como criamos valor.',
            'main_heading' => 'Trabalhamos com marcas corajosas para criar experiências audiovisuais que as pessoas sentem e recordam. Trabalho ousado pede uma abordagem sem medo.',
            'subtext' => 'Nascida da paixão pela narrativa visual e marketing de atenção, a Mizine Produção une técnicas cinematográficas a estratégias modernas de conteúdo para destacar a sua marca no mercado.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Reels
        DB::table('reels')->truncate();
        $reels = [
            ['title' => 'Branding & Posicionamento', 'subtitle' => 'Comercial & Awareness / 2026', 'art_class' => 'a1', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 1],
            ['title' => 'Cobertura de Evento VIP', 'subtitle' => 'Aftermovie & Dinamismo / 2026', 'art_class' => 'a2', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 2],
            ['title' => 'Storytelling de Marca', 'subtitle' => 'Narrativa Cinematográfica / 2025', 'art_class' => 'a3', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 3],
            ['title' => 'Reels de Alta Retenção', 'subtitle' => 'Social Media & Viral / 2026', 'art_class' => 'a4', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 4],
            ['title' => 'Fashion & Lifestyle', 'subtitle' => 'Editorial Audiovisual / 2025', 'art_class' => 'a5', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 5],
            ['title' => 'Showcase Corporativo', 'subtitle' => 'Apresentação Empresarial / 2026', 'art_class' => 'a6', 'video_url' => 'https://www.instagram.com/mizine_8/reels/', 'order' => 6],
        ];
        foreach ($reels as $r) {
            DB::table('reels')->insert(array_merge($r, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Projects
        DB::table('projects')->truncate();
        $projects = [
            [
                'title' => 'Campanha de Posicionamento de Marca',
                'description' => 'Direção criativa, captação 4K e edição dinâmica para lançamento nacional com foco em autoridade e conexão com o público.',
                'is_wide' => true,
                'art_class' => 'a3',
                'link_url' => 'https://www.instagram.com/mizine_8',
                'order' => 1
            ],
            [
                'title' => 'Série de Reels de Alto Engajamento',
                'description' => 'Pacote estratégico de vídeos verticais otimizados para Instagram e TikTok com retenção e estética cinematográfica.',
                'is_wide' => false,
                'art_class' => 'a1',
                'link_url' => 'https://www.instagram.com/mizine_8',
                'order' => 2
            ],
            [
                'title' => 'Cobertura Cinematográfica de Eventos',
                'description' => 'Captação dinâmica dos melhores momentos, entregando vídeos teaser no próprio dia e aftermovie final memorável.',
                'is_wide' => false,
                'art_class' => 'a5',
                'link_url' => 'https://www.instagram.com/mizine_8',
                'order' => 3
            ],
        ];
        foreach ($projects as $p) {
            DB::table('projects')->insert(array_merge($p, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Clients
        DB::table('clients')->truncate();
        $clients = ['GEEK MOÇAMBIQUE', 'MIZINE CELEBRATE', 'MAPUTO CREATIVE', 'STUDIO 8', 'VALOR DIGITAL', 'BRAND MZ'];
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
            ['quote' => '“A Mizine elevou a perceção da nossa marca a outro patamar. O vídeo de lançamento teve um acabamento estético e impacto incomparáveis.”', 'author' => 'Moises Mabunda', 'company' => 'Direção Criativa', 'order' => 1],
            ['quote' => '“Agilidade na entrega, olhar refinado de câmara e uma compreensão profunda de marketing de atenção. Superou todas as expectativas.”', 'author' => 'Sara Tembe', 'company' => 'Brand & Marketing', 'order' => 2],
            ['quote' => '“Os reels produzidos pela equipa multiplicaram as visualizações e o engajamento orgânico do nosso perfil nas primeiras semanas.”', 'author' => 'Carlos Mondlane', 'company' => 'Empreendedor', 'order' => 3],
        ];
        foreach ($testimonials as $t) {
            DB::table('testimonials')->insert(array_merge($t, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Timeline
        DB::table('timeline_items')->truncate();
        $timeline = [
            ['year_label' => '2023', 'title' => 'Início da Mizine', 'description' => 'Primeiras produções audiovisuais e criação do olhar de cinema aplicado a marcas e projetos locais.', 'order' => 1],
            ['year_label' => '2024', 'title' => 'Consolidação Criativa', 'description' => 'Expansão para campanhas publicitárias completas, reels virais e atendimento a marcas corporativas.', 'order' => 2],
            ['year_label' => '2025', 'title' => 'Diversificação do Grupo', 'description' => 'Crescimento da equipa e nascimento de iniciativas paralelas como Mizine Celebrate e Geek.', 'order' => 3],
            ['year_label' => '2026', 'title' => 'Ecossistema Audiovisual', 'description' => 'Plataforma digital própria, liderança em vídeos curtos e expansão para produções de grande escala.', 'order' => 4],
        ];
        foreach ($timeline as $tl) {
            DB::table('timeline_items')->insert(array_merge($tl, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Team
        DB::table('team_members')->truncate();
        $team = [
            ['name' => 'Moisés Mabunda', 'role' => 'Fundador & Diretor Criativo', 'initial' => 'M', 'avatar_url' => '/logo-m.jpg', 'order' => 1],
            ['name' => 'Direção de Fotografia', 'role' => 'Cinematografia & Luz', 'initial' => 'D', 'order' => 2],
            ['name' => 'Edição & Color Grading', 'role' => 'Montagem & Pós-Produção', 'initial' => 'E', 'order' => 3],
            ['name' => 'Estratégia de Marketing', 'role' => 'Storytelling & Social', 'initial' => 'S', 'order' => 4],
        ];
        foreach ($team as $tm) {
            DB::table('team_members')->insert(array_merge($tm, ['created_at' => now(), 'updated_at' => now()]));
        }

        // Group companies
        DB::table('group_companies')->truncate();
        $group = [
            ['name' => 'Mizine Celebrate', 'description' => 'Convites digitais interativos e cobertura para eventos e casamentos inesquecíveis.', 'button_text' => 'Visitar', 'link_url' => 'https://instagram.com/mizine_celebrate', 'order' => 1],
            ['name' => 'Geek Moçambique', 'description' => 'Plataforma digital, inovação tecnológica e aplicativos.', 'button_text' => 'Visitar', 'link_url' => 'https://geek.mizine.co.mz', 'order' => 2],
            ['name' => 'Mizine Academy', 'description' => 'Workshops e conteúdos sobre audiovisual, edição e marketing de conteúdo.', 'button_text' => 'Visitar', 'link_url' => 'https://www.instagram.com/mizine_8', 'order' => 3],
        ];
        foreach ($group as $g) {
            DB::table('group_companies')->insert(array_merge($g, ['created_at' => now(), 'updated_at' => now()]));
        }
    }
}
