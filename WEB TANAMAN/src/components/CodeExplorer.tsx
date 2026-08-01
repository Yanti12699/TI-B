import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Copy, Check, Download, Info } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
  content: string;
}

export default function CodeExplorer() {
  const [selectedPath, setSelectedPath] = useState<string>('database.sql');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'app': true,
    'app/core': true,
    'app/controllers': true,
    'app/models': false,
    'config': true,
    'public': false,
  });
  const [copied, setCopied] = useState(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileTree: FileNode[] = [
    {
      name: '.htaccess',
      type: 'file',
      path: '.htaccess',
      content: `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^$ public/ [L]
    RewriteRule (.*) public/$1 [L]
</IfModule>`
    },
    {
      name: 'database.sql',
      type: 'file',
      path: 'database.sql',
      content: `-- Website E-Commerce Tanaman Hias Premium Database Dump
-- Target Database: \`plant_store_db\`

CREATE DATABASE IF NOT EXISTS \`plant_store_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE \`plant_store_db\`;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL UNIQUE,
  \`password\` varchar(255) NOT NULL,
  \`full_name\` varchar(100) NOT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`phone\` varchar(20) DEFAULT NULL,
  \`address\` text DEFAULT NULL,
  \`role\` enum('admin','user') NOT NULL DEFAULT 'user',
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`products\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`category_id\` int(11) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`slug\` varchar(100) NOT NULL UNIQUE,
  \`price\` decimal(12,2) NOT NULL,
  \`description\` text NOT NULL,
  \`care_instructions\` text DEFAULT NULL,
  \`image_url\` varchar(255) DEFAULT NULL,
  \`stock\` int(11) NOT NULL DEFAULT 0,
  \`is_flash_sale\` tinyint(1) NOT NULL DEFAULT 0,
  \`flash_sale_price\` decimal(12,2) DEFAULT NULL,
  \`is_best_seller\` tinyint(1) NOT NULL DEFAULT 0,
  \`is_premium\` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    {
      name: 'config',
      type: 'folder',
      path: 'config',
      content: '',
      children: [
        {
          name: 'config.php',
          type: 'file',
          path: 'config/config.php',
          content: `<?php
/**
 * Master Configuration File
 */
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'plant_store_db');

define('BASEURL', 'http://localhost/plant-store');

define('DEFAULT_ADMIN_RECIPIENT', 'Siti Nurbayanti');
define('DEFAULT_ADMIN_BCA', '8920194812');
define('DEFAULT_ADMIN_EWALLET', '081298765432');`
        }
      ]
    },
    {
      name: 'app',
      type: 'folder',
      path: 'app',
      content: '',
      children: [
        {
          name: 'core',
          type: 'folder',
          path: 'app/core',
          content: '',
          children: [
            {
              name: 'App.php',
              type: 'file',
              path: 'app/core/App.php',
              content: `<?php
/**
 * Routing Engine (App Class)
 */
class App {
    protected $controller = 'HomeController';
    protected $method = 'index';
    protected $params = [];

    public function __construct() {
        $url = $this->parseUrl();
        if ($url && file_exists('../app/controllers/' . ucfirst($url[0]) . 'Controller.php')) {
            $this->controller = ucfirst($url[0]) . 'Controller';
            unset($url[0]);
        }
        require_once '../app/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }
        $this->params = $url ? array_values($url) : [];
        call_user_func_array([$this->controller, $this->method], $this->params);
    }
    public function parseUrl() {
        if (isset($_GET['url'])) {
            return explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL));
        }
    }
}`
            },
            {
              name: 'Controller.php',
              type: 'file',
              path: 'app/core/Controller.php',
              content: `<?php
class Controller {
    public function model($model) {
        require_once '../app/models/' . $model . '.php';
        return new $model();
    }
    public function view($view, $data = []) {
        require_once '../app/views/' . $view . '.php';
    }
    public function sanitize($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}`
            },
            {
              name: 'Database.php',
              type: 'file',
              path: 'app/core/Database.php',
              content: `<?php
class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $dbh;
    private $stmt;

    public function __construct() {
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ];
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }
    public function query($sql) { $this->stmt = $this->dbh->prepare($sql); }
    public function bind($param, $value) { $this->stmt->bindValue($param, $value); }
    public function execute() { return $this->stmt->execute(); }
    public function resultSet() { $this->execute(); return $this->stmt->fetchAll(); }
    public function single() { $this->execute(); return $this->stmt->fetch(); }
}`
            }
          ]
        },
        {
          name: 'controllers',
          type: 'folder',
          path: 'app/controllers',
          content: '',
          children: [
            {
              name: 'HomeController.php',
              type: 'file',
              path: 'app/controllers/HomeController.php',
              content: `<?php
class HomeController extends Controller {
    public function index() {
        $data['title'] = 'FloraPremium Store';
        $data['categories'] = $this->model('CategoryModel')->getAllCategories();
        $data['new_products'] = $this->model('ProductModel')->getBestSellers(4);
        $data['settings'] = $this->model('SettingModel')->getSettings();

        $this->view('templates/header', $data);
        $this->view('home/index', $data);
        $this->view('templates/footer', $data);
    }
}`
            },
            {
              name: 'AdminController.php',
              type: 'file',
              path: 'app/controllers/AdminController.php',
              content: `<?php
class AdminController extends Controller {
    public function __construct() {
        Session::requireAdmin();
    }
    public function index() {
        $data['summary'] = $this->model('OrderModel')->getSalesSummary();
        $data['settings'] = $this->model('SettingModel')->getSettings();
        $this->view('templates/admin_header', $data);
        $this->view('admin/dashboard', $data);
        $this->view('templates/admin_footer', $data);
    }
    public function settings() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->model('SettingModel')->updateSettings($_POST);
            Flasher::setFlash('Pengaturan Atas Nama Siti Nurbayanti diperbarui!', 'success');
        }
    }
}`
            }
          ]
        },
        {
          name: 'models',
          type: 'folder',
          path: 'app/models',
          content: '',
          children: [
            {
              name: 'ProductModel.php',
              type: 'file',
              path: 'app/models/ProductModel.php',
              content: `<?php
class ProductModel {
    private $db;
    public function __construct() { $this->db = new Database(); }
    public function getAllProducts() {
        $this->db->query("SELECT * FROM products ORDER BY id DESC");
        return $this->db->resultSet();
    }
}`
            },
            {
              name: 'SettingModel.php',
              type: 'file',
              path: 'app/models/SettingModel.php',
              content: `<?php
class SettingModel {
    private $db;
    public function __construct() { $this->db = new Database(); }
    public function getSettings() {
        $this->db->query("SELECT * FROM settings WHERE id = 1");
        return $this->db->single();
    }
    public function updateSettings($data) {
        $this->db->query("UPDATE settings SET bank_recipient = :recipient, bank_account_no = :bca WHERE id = 1");
        $this->db->bind(':recipient', $data['bank_recipient']);
        $this->db->bind(':bca', $data['bank_account_no']);
        return $this->db->execute();
    }
}`
            }
          ]
        }
      ]
    },
    {
      name: 'public',
      type: 'folder',
      path: 'public',
      content: '',
      children: [
        {
          name: 'index.php',
          type: 'file',
          path: 'public/index.php',
          content: `<?php
require_once '../config/config.php';
spl_autoload_register(function ($class) {
    require_once '../app/core/' . $class . '.php';
});
$app = new App();`
        }
      ]
    },
    {
      name: 'README.md',
      type: 'file',
      path: 'README.md',
      content: `# Nusantara Flora - E-Commerce Tanaman Hias Premium
Website e-commerce premium berbasis PHP Native MVC, Bootstrap 5, dan PDO MySQL.

## Kredensial Uji Coba Default:
- **Admin**: \`admin\` / \`admin123\`
- **User**: \`budi\` / \`user123\`

## Menjalankan di XAMPP:
1. Pindahkan folder ke \`C:\\xampp\\htdocs\\plant-store\`
2. Impor \`database.sql\` di phpMyAdmin.
3. Buka \`http://localhost/plant-store\``
    }
  ];

  // Helper to find a file by its path
  const findFileContent = (nodes: FileNode[], path: string): string => {
    for (const node of nodes) {
      if (node.path === path) return node.content;
      if (node.children) {
        const found = findFileContent(node.children, path);
        if (found) return found;
      }
    }
    return '';
  };

  const activeContent = findFileContent(fileTree, selectedPath) || 'Pilih file dari menu explorer untuk melihat isinya.';

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isExpanded = expandedFolders[node.path];
      const isSelected = selectedPath === node.path;

      return (
        <div key={node.path} style={{ paddingLeft: `${depth * 12}px` }}>
          {isFolder ? (
            <div>
              <button
                onClick={() => toggleFolder(node.path)}
                className="flex items-center w-full py-1 px-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors text-left"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 mr-1 text-slate-500" /> : <ChevronRight className="w-4 h-4 mr-1 text-slate-500" />}
                <Folder className="w-4 h-4 mr-2 text-emerald-400 fill-emerald-400/10" />
                <span>{node.name}</span>
              </button>
              {isExpanded && node.children && renderTree(node.children, depth + 1)}
            </div>
          ) : (
            <button
              onClick={() => setSelectedPath(node.path)}
              className={`flex items-center w-full py-1 px-2 text-sm rounded transition-colors text-left ${
                isSelected ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <File className={`w-4 h-4 mr-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{node.name}</span>
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-sans text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-emerald-400">PHP Native 8.3 MVC Source Code Explorer</h3>
          <p className="text-xs text-slate-400 mt-1">Seluruh file di bawah ini telah ditulis secara lengkap dalam folder workspace <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">/plant-store/</code>.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(activeContent)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Tersalin!' : 'Salin Kode'}
          </button>
        </div>
      </div>

      <div className="flex h-[520px] divide-x divide-slate-800">
        {/* Left Tree Explorer */}
        <div className="w-1/3 bg-slate-950 p-4 overflow-y-auto select-none space-y-1">
          <div className="text-slate-500 uppercase font-bold tracking-wider text-[10px] mb-3 px-2">Struktur Proyek PHP MVC</div>
          {renderTree(fileTree)}
        </div>

        {/* Right Code Viewer */}
        <div className="w-2/3 bg-slate-900 flex flex-col h-full overflow-hidden">
          <div className="bg-slate-950/50 px-4 py-2 text-xs text-slate-500 font-mono border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {selectedPath}
          </div>
          <pre className="p-5 overflow-auto text-xs font-mono text-slate-300 leading-relaxed bg-slate-900/50 flex-1 scrollbar-thin">
            <code>{activeContent}</code>
          </pre>
        </div>
      </div>

      <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <p>
          Anda dapat mengekspor seluruh proyek PHP ini langsung dengan menekan tombol **Export** di kanan atas menu AI Studio (ZIP / GitHub) untuk membukanya di VS Code lokal atau XAMPP Anda.
        </p>
      </div>
    </div>
  );
}
