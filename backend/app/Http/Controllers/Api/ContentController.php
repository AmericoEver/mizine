<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ContentController extends Controller
{
    /** Validade da sessão de administração (horas) */
    private const TOKEN_TTL_HOURS = 12;

    /**
     * Verifica o token Bearer emitido no login (guardado em cache, só o hash).
     * Devolve uma resposta 401 quando o pedido não está autenticado, ou null quando está.
     */
    private function denyUnlessAdmin(Request $request)
    {
        $token = (string) $request->bearerToken();
        if ($token === '' || !Cache::store('file')->has('admin_token:' . hash('sha256', $token))) {
            return response()->json(['success' => false, 'message' => 'Não autorizado.'], 401);
        }
        return null;
    }

    // Retorna todo o conteúdo do site
    public function getContent()
    {
        $heroRow = DB::table('hero_settings')->first();
        $aboutRow = DB::table('about_settings')->first();

        $hero = [
            'title' => $heroRow->title ?? "Mizine\nProdução",
            'tagline' => $heroRow->tagline ?? '',
            'coverImageUrl' => $heroRow->cover_image_url ?? '',
            'bannerDate' => $heroRow->banner_date ?? '[00/00]',
            'bannerTitle' => $heroRow->banner_title ?? '[Evento recente]',
            'bannerDescription' => $heroRow->banner_description ?? '',
            'intentTitle' => $heroRow->intent_title ?? "Cada plano\ntem uma intenção",
            'intentSubtitle' => $heroRow->intent_subtitle ?? '',
            'showreelVideoUrl' => $heroRow->showreel_video_url ?? '',
            'whatsappNumber' => $heroRow->whatsapp_number ?? '+258 00 000 0000',
            'whatsappUrl' => $heroRow->whatsapp_url ?? 'https://wa.me/258000000000',
            'instagramHandle' => $heroRow->instagram_handle ?? '@mizine',
            'instagramUrl' => $heroRow->instagram_url ?? 'https://instagram.com/mizine',
            'contactEmail' => $heroRow->contact_email ?? 'ola@mizine.com',
        ];

        $about = [
            'tagTitle' => $aboutRow->tag_title ?? 'Abordagem',
            'tagSubtitle' => $aboutRow->tag_subtitle ?? 'Quem somos e como trabalhamos.',
            'mainHeading' => $aboutRow->main_heading ?? '',
            'subtext' => $aboutRow->subtext ?? '',
        ];

        $reels = DB::table('reels')->where('is_active', true)->orderBy('order')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'title' => $r->title,
                'subtitle' => $r->subtitle,
                'videoUrl' => $r->video_url ?? '',
                'imageUrl' => $r->image_url ?? '',
                'artClass' => $r->art_class ?? 'a1',
                'order' => $r->order,
            ];
        });

        $projects = DB::table('projects')->where('is_active', true)->orderBy('order')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'isWide' => (bool)$p->is_wide,
                'artClass' => $p->art_class ?? 'a3',
                'imageUrl' => $p->image_url ?? '',
                'linkUrl' => $p->link_url ?? '#contacto',
                'order' => $p->order,
            ];
        });

        $clients = DB::table('clients')->where('is_active', true)->orderBy('order')->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'logoUrl' => $c->logo_url ?? '',
                'order' => $c->order,
            ];
        });

        $testimonials = DB::table('testimonials')->where('is_active', true)->orderBy('order')->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'quote' => $t->quote,
                'author' => $t->author,
                'company' => $t->company,
                'order' => $t->order,
            ];
        });

        $timeline = DB::table('timeline_items')->where('is_active', true)->orderBy('order')->get()->map(function ($tl) {
            return [
                'id' => $tl->id,
                'yearLabel' => $tl->year_label,
                'title' => $tl->title,
                'description' => $tl->description,
                'order' => $tl->order,
            ];
        });

        $team = DB::table('team_members')->where('is_active', true)->orderBy('order')->get()->map(function ($tm) {
            return [
                'id' => $tm->id,
                'name' => $tm->name,
                'role' => $tm->role,
                'initial' => $tm->initial,
                'avatarUrl' => $tm->avatar_url,
                'order' => $tm->order,
            ];
        });

        $group = DB::table('group_companies')->where('is_active', true)->orderBy('order')->get()->map(function ($g) {
            return [
                'id' => $g->id,
                'name' => $g->name,
                'description' => $g->description,
                'buttonText' => $g->button_text,
                'linkUrl' => $g->link_url,
                'order' => $g->order,
            ];
        });

        return response()->json([
            'hero' => $hero,
            'about' => $about,
            'reels' => $reels,
            'projects' => $projects,
            'clients' => $clients,
            'testimonials' => $testimonials,
            'timeline' => $timeline,
            'team' => $team,
            'group' => $group,
        ]);
    }

    // Recebe envio de contacto
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'projectType' => 'nullable|string|max:100',
            'message' => 'required|string|max:5000',
        ]);

        DB::table('contact_messages')->insert([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'project_type' => $validated['projectType'] ?? 'Reels e vídeos curtos',
            'message' => $validated['message'],
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mensagem enviada com sucesso! Entraremos em contacto.',
        ]);
    }

    // Login Admin
    public function login(Request $request)
    {
        $password = (string) $request->input('password');
        $validPassword = (string) env('ADMIN_PASSWORD', '');

        // Sem ADMIN_PASSWORD configurada no .env do servidor, o painel fica fechado.
        if ($validPassword !== '' && hash_equals($validPassword, $password)) {
            $token = bin2hex(random_bytes(32));
            Cache::store('file')->put('admin_token:' . hash('sha256', $token), true, now()->addHours(self::TOKEN_TTL_HOURS));
            return response()->json([
                'success' => true,
                'token' => $token,
                'message' => 'Autenticado com sucesso.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Senha incorreta.',
        ], 401);
    }

    // Salvar conteúdo integral pelo Admin
    public function updateFullContent(Request $request)
    {
        if ($deny = $this->denyUnlessAdmin($request)) {
            return $deny;
        }
        $data = $request->all();

        // Atualizar Hero
        if (isset($data['hero'])) {
            $h = $data['hero'];
            DB::table('hero_settings')->updateOrInsert(['id' => 1], [
                'title' => $h['title'] ?? "Mizine\nProdução",
                'tagline' => $h['tagline'] ?? '',
                'cover_image_url' => $h['coverImageUrl'] ?? ($h['cover_image_url'] ?? null),
                'banner_date' => $h['bannerDate'] ?? '',
                'banner_title' => $h['bannerTitle'] ?? '',
                'banner_description' => $h['bannerDescription'] ?? '',
                'intent_title' => $h['intentTitle'] ?? '',
                'intent_subtitle' => $h['intentSubtitle'] ?? '',
                'showreel_video_url' => $h['showreelVideoUrl'] ?? '',
                'whatsapp_number' => $h['whatsappNumber'] ?? '',
                'whatsapp_url' => $h['whatsappUrl'] ?? '',
                'instagram_handle' => $h['instagramHandle'] ?? '',
                'instagram_url' => $h['instagramUrl'] ?? '',
                'contact_email' => $h['contactEmail'] ?? '',
                'updated_at' => now(),
            ]);
        }

        // Atualizar About
        if (isset($data['about'])) {
            $a = $data['about'];
            DB::table('about_settings')->updateOrInsert(['id' => 1], [
                'tag_title' => $a['tagTitle'] ?? 'Abordagem',
                'tag_subtitle' => $a['tagSubtitle'] ?? '',
                'main_heading' => $a['mainHeading'] ?? '',
                'subtext' => $a['subtext'] ?? '',
                'updated_at' => now(),
            ]);
        }

        // Atualizar Reels
        if (isset($data['reels']) && is_array($data['reels'])) {
            DB::table('reels')->truncate();
            foreach ($data['reels'] as $idx => $r) {
                DB::table('reels')->insert([
                    'title' => $r['title'] ?? 'Reel',
                    'subtitle' => $r['subtitle'] ?? '',
                    'video_url' => $r['videoUrl'] ?? '',
                    'image_url' => $r['imageUrl'] ?? null,
                    'art_class' => $r['artClass'] ?? 'a1',
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Projects
        if (isset($data['projects']) && is_array($data['projects'])) {
            DB::table('projects')->truncate();
            foreach ($data['projects'] as $idx => $p) {
                DB::table('projects')->insert([
                    'title' => $p['title'] ?? 'Projeto',
                    'description' => $p['description'] ?? '',
                    'is_wide' => !empty($p['isWide']),
                    'art_class' => $p['artClass'] ?? 'a3',
                    'image_url' => $p['imageUrl'] ?? null,
                    'link_url' => $p['linkUrl'] ?? '#contacto',
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Clientes
        if (isset($data['clients']) && is_array($data['clients'])) {
            DB::table('clients')->truncate();
            foreach ($data['clients'] as $idx => $c) {
                DB::table('clients')->insert([
                    'name' => is_array($c) ? ($c['name'] ?? '') : $c,
                    'logo_url' => is_array($c) ? ($c['logoUrl'] ?? ($c['logo_url'] ?? null)) : null,
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Testemunhos
        if (isset($data['testimonials']) && is_array($data['testimonials'])) {
            DB::table('testimonials')->truncate();
            foreach ($data['testimonials'] as $idx => $t) {
                DB::table('testimonials')->insert([
                    'quote' => $t['quote'] ?? '',
                    'author' => $t['author'] ?? '',
                    'company' => $t['company'] ?? '',
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Timeline
        if (isset($data['timeline']) && is_array($data['timeline'])) {
            DB::table('timeline_items')->truncate();
            foreach ($data['timeline'] as $idx => $tl) {
                DB::table('timeline_items')->insert([
                    'year_label' => $tl['yearLabel'] ?? '',
                    'title' => $tl['title'] ?? '',
                    'description' => $tl['description'] ?? '',
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Equipa
        if (isset($data['team']) && is_array($data['team'])) {
            DB::table('team_members')->truncate();
            foreach ($data['team'] as $idx => $tm) {
                DB::table('team_members')->insert([
                    'name' => $tm['name'] ?? '',
                    'role' => $tm['role'] ?? '',
                    'initial' => $tm['initial'] ?? (isset($tm['name']) ? substr($tm['name'], 0, 1) : 'M'),
                    'avatar_url' => $tm['avatarUrl'] ?? null,
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Atualizar Grupo
        if (isset($data['group']) && is_array($data['group'])) {
            DB::table('group_companies')->truncate();
            foreach ($data['group'] as $idx => $g) {
                DB::table('group_companies')->insert([
                    'name' => $g['name'] ?? '',
                    'description' => $g['description'] ?? '',
                    'button_text' => $g['buttonText'] ?? 'Visitar',
                    'link_url' => $g['linkUrl'] ?? '#',
                    'order' => $idx + 1,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Conteúdo atualizado com sucesso.',
        ]);
    }

    // Mensagens de contacto
    public function getMessages(Request $request)
    {
        if ($deny = $this->denyUnlessAdmin($request)) {
            return $deny;
        }
        $messages = DB::table('contact_messages')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'projectType' => $m->project_type,
                    'message' => $m->message,
                    'isRead' => (bool)$m->is_read,
                    'createdAt' => $m->created_at,
                ];
            });

        return response()->json($messages);
    }

    public function deleteMessage(Request $request, $id)
    {
        if ($deny = $this->denyUnlessAdmin($request)) {
            return $deny;
        }
        DB::table('contact_messages')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // Upload de arquivo / imagem de capa a partir do computador
    public function uploadFile(Request $request)
    {
        if ($deny = $this->denyUnlessAdmin($request)) {
            return $deny;
        }
        // SVG excluído: pode transportar scripts (XSS)
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,mp4,mov|max:51200',
        ]);

        $file = $request->file('file');
        // extensão a partir do conteúdo real do ficheiro, não do nome enviado
        $ext = $file->guessExtension() ?: 'jpg';
        $filename = 'cover_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

        $targetDir = dirname(base_path()) . '/media/uploads';
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        $localDir = public_path('media/uploads');
        if (!is_dir($localDir)) {
            @mkdir($localDir, 0755, true);
        }

        $frontendDir = dirname(base_path(), 2) . '/frontend/public/media/uploads';
        if (!is_dir($frontendDir)) {
            @mkdir($frontendDir, 0755, true);
        }

        // Salvar arquivo
        $file->move($targetDir, $filename);
        $savedFile = $targetDir . '/' . $filename;

        if (is_file($savedFile)) {
            if ($localDir !== $targetDir) {
                @copy($savedFile, $localDir . '/' . $filename);
            }
            if (is_dir($frontendDir)) {
                @copy($savedFile, $frontendDir . '/' . $filename);
            }
        }

        $url = '/media/uploads/' . $filename;

        return response()->json([
            'success' => true,
            'url' => $url,
            'filename' => $filename,
        ]);
    }
}

